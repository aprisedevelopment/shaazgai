import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export interface CategoryNode {
  id: number
  cat: number
  title: string
  image: string | null
  list_order: number
  publish: number
  directCount: number
  totalCount: number
  level: number
  children: CategoryNode[]
}

export interface AdminCategoryItem {
  id: number
  cat: number
  title: string
  image: string | null
  list_order: number
  publish: number
  directCount: number
  totalCount: number
  level: number
  isSub: boolean
  pathTitle: string
}

/**
 * Builds the complete category tree with accurate product counts
 */
async function buildFullCategoryTree(): Promise<CategoryNode[]> {
  // 1. Fetch categories
  const rawCats = await prisma.category.findMany({
    orderBy: [
      { list_order: 'asc' },
      { id: 'asc' }
    ]
  })

  // 2. Fetch published products catvars
  const products = await prisma.product.findMany({
    where: { publish: 1 },
    select: { id: true, catvars: true }
  })

  // 3. Map direct product counts
  const directCounts: Record<number, number> = {}
  rawCats.forEach(c => { directCounts[c.id] = 0 })

  products.forEach(p => {
    if (!p.catvars) return
    // catvars format: ':14::72::166:'
    const tokens = p.catvars.split(':').map(s => s.trim()).filter(Boolean)
    tokens.forEach(tok => {
      const cid = parseInt(tok, 10)
      if (directCounts[cid] !== undefined) {
        directCounts[cid]++
      }
    })
  })

  // 4. Map nodes
  const map: Record<number, CategoryNode> = {}
  rawCats.forEach(c => {
    map[c.id] = {
      id: c.id,
      cat: c.cat,
      title: c.title.trim(),
      image: c.image || null,
      list_order: c.list_order,
      publish: c.publish,
      directCount: directCounts[c.id] || 0,
      totalCount: directCounts[c.id] || 0,
      level: 0,
      children: []
    }
  })

  // 5. Connect parents and children
  const roots: CategoryNode[] = []
  rawCats.forEach(c => {
    const node = map[c.id]
    if (c.cat === 0 || !map[c.cat]) {
      node.level = 0
      roots.push(node)
    } else {
      map[c.cat].children.push(node)
    }
  })

  // 6. Recursively assign level and calculate totalCount (parent count + all descendants)
  function computeRecursive(node: CategoryNode, currentLevel: number): number {
    node.level = currentLevel
    let sum = node.directCount
    for (const child of node.children) {
      sum += computeRecursive(child, currentLevel + 1)
    }
    node.totalCount = sum
    return sum
  }

  roots.forEach(root => computeRecursive(root, 0))

  return roots
}

/**
 * Filter tree to only include categories that have totalCount > 0 and publish === 1.
 * If a category has 0 products, it and its children are hidden from the frontend.
 */
function filterFrontendTree(nodes: CategoryNode[]): CategoryNode[] {
  return nodes
    .filter(n => n.publish === 1 && n.totalCount > 0)
    .map(n => ({
      ...n,
      children: filterFrontendTree(n.children)
    }))
}

/**
 * Cached getter for frontend categories tree
 * Only returns active categories that actually have products (totalCount > 0)
 */
export const getFrontendCategories = unstable_cache(
  async (): Promise<CategoryNode[]> => {
    const fullTree = await buildFullCategoryTree()
    return filterFrontendTree(fullTree)
  },
  ['frontend-categories-tree-v2'],
  { revalidate: 120, tags: ['categories'] }
)

/**
 * Flatten tree into depth-first list for admin views
 */
function flattenTreeForAdmin(
  nodes: CategoryNode[],
  parentPath: string = ''
): AdminCategoryItem[] {
  const result: AdminCategoryItem[] = []
  for (const node of nodes) {
    const currentPath = parentPath ? `${parentPath} > ${node.title}` : node.title
    result.push({
      id: node.id,
      cat: node.cat,
      title: node.title,
      image: node.image,
      list_order: node.list_order,
      publish: node.publish,
      directCount: node.directCount,
      totalCount: node.totalCount,
      level: node.level,
      isSub: node.level > 0,
      pathTitle: currentPath
    })
    if (node.children.length > 0) {
      result.push(...flattenTreeForAdmin(node.children, currentPath))
    }
  }
  return result
}

/**
 * Cached getter for admin categories
 * Returns all 265 categories in hierarchical order with product counts and depth levels
 */
export const getAllCategoriesForAdmin = unstable_cache(
  async (): Promise<AdminCategoryItem[]> => {
    const fullTree = await buildFullCategoryTree()
    return flattenTreeForAdmin(fullTree)
  },
  ['admin-categories-list-v2'],
  { revalidate: 120, tags: ['categories'] }
)

/**
 * Helper to get all descendant IDs for a category (including itself)
 */
export async function getCategoryDescendantIds(catId: number): Promise<number[]> {
  const allCats = await prisma.category.findMany({ select: { id: true, cat: true } })
  const result: number[] = [catId]
  
  function collectChildren(parentId: number) {
    const children = allCats.filter(c => c.cat === parentId)
    for (const child of children) {
      result.push(child.id)
      collectChildren(child.id)
    }
  }
  
  collectChildren(catId)
  return result
}
