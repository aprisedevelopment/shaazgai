const mariadb = require('mariadb');
const fs = require('fs');

async function checkSchema() {
  const schemaStr = fs.readFileSync('prisma/schema.prisma', 'utf-8');
  const models = [];
  
  let currentModel = null;
  for (const line of schemaStr.split('\n')) {
    const m = line.match(/^model\s+(\w+)\s+\{/);
    if (m) {
      currentModel = { name: m[1], fields: [], map: m[1] };
      models.push(currentModel);
      continue;
    }
    
    if (currentModel && line.match(/^\}/)) {
      currentModel = null;
      continue;
    }
    
    if (currentModel) {
      const mapMatch = line.match(/@@map\("([^"]+)"\)/);
      if (mapMatch) {
        currentModel.map = mapMatch[1];
        continue;
      }
      
      const fieldMatch = line.trim().match(/^(\w+)\s+(\w+)(\??)(\s|\[|@)/);
      if (fieldMatch) {
        // Exclude relations (e.g. product Product @relation...)
        if (!line.includes('@relation') && !line.includes('[]')) {
          let fieldName = fieldMatch[1];
          // Check if @map is used on the field
          const fieldMapMatch = line.match(/@map\("([^"]+)"\)/);
          if (fieldMapMatch) {
            fieldName = fieldMapMatch[1];
          }
          currentModel.fields.push(fieldName);
        }
      }
    }
  }

  let conn;
  try {
    conn = await mariadb.createConnection({ host: 'localhost', user: 'root', password: '', database: 'tugeelt' });
    
    for (const model of models) {
      try {
        const rows = await conn.query(`DESCRIBE ${model.map}`);
        const dbCols = rows.map(r => r.Field);
        
        const missingInDb = model.fields.filter(f => !dbCols.includes(f));
        if (missingInDb.length > 0) {
          console.log(`\n❌ Model ${model.name} (Table: ${model.map}) mismatches!`);
          console.log(`Fields in Prisma but NOT in DB:`, missingInDb);
          console.log(`Actual DB columns:`, dbCols);
        } else {
          // console.log(`✅ Model ${model.name} matches.`);
        }
      } catch (err) {
        console.log(`\n❌ Error querying table ${model.map}:`, err.message);
      }
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.end();
  }
}

checkSchema();
