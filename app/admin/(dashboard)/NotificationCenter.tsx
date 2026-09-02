'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, ExternalLink } from 'lucide-react'
import { getNotifications, markAsRead, markAllAsRead } from '../notificationActions'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    const data = await getNotifications()
    setNotifications(prev => {
      // Check for new unread notifications that we didn't have before to show a toast
      if (prev.length > 0) {
        const prevUnreadIds = new Set(prev.filter(n => !n.isRead).map(n => n.id))
        const newUnreads = data.filter(n => !n.isRead && !prevUnreadIds.has(n.id))
        
        if (newUnreads.length > 0) {
          // Play sound alert
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
          audio.volume = 0.5
          audio.play().catch(e => console.log('Аудио тоглуулах боломжгүй:', e))
        }

        newUnreads.forEach(n => {
          toast((t) => (
            <div 
              onClick={() => {
                toast.dismiss(t.id)
                handleNotificationClick(n)
              }} 
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <b style={{ fontSize: 14 }}>{n.title}</b>
              <span style={{ fontSize: 12, opacity: 0.9 }}>{n.message}</span>
              {n.link && <span style={{ fontSize: 11, color: '#4facfe', marginTop: 4 }}>Дэлгэрэнгүй харах &rarr;</span>}
            </div>
          ), {
            icon: '🔔',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            duration: 5000,
          })
        })
      }
      return data
    })
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 10 seconds
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleNotificationClick = async (n: any) => {
    if (!n.isRead) {
      await markAsRead(n.id)
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item))
    }
    setIsOpen(false)
    if (n.link) {
      router.push(n.link)
    }
  }

  const handleMarkAll = async () => {
    await markAllAsRead()
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })))
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          position: 'relative',
          padding: 8,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isOpen ? 'rgba(0,0,0,0.05)' : 'transparent'
        }}
      >
        <Bell size={24} color="#333" />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: 4,
            right: 4,
            background: 'var(--danger)',
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
            borderRadius: 10,
            padding: '2px 6px',
            border: '2px solid #fff'
          }}>
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 8,
          width: 320,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Мэдэгдэл</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, cursor: 'pointer' }}>
                Бүгдийг унших
              </button>
            )}
          </div>
          
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>Мэдэгдэл алга</div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer',
                    background: n.isRead ? '#fff' : '#f0f7ff',
                    opacity: n.isRead ? 0.7 : 1,
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {!n.isRead && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', position: 'absolute', left: 8, top: 18 }} />
                  )}
                  <div style={{ marginLeft: n.isRead ? 0 : 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <b style={{ fontSize: 14, color: '#333' }}>{n.title}</b>
                      <span style={{ fontSize: 11, color: '#999' }}>
                        {new Date(n.createdAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: n.link ? 8 : 0 }}>
                      {n.message}
                    </div>
                    {n.link && (
                      <div style={{ fontSize: 12, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ExternalLink size={12} /> Дэлгэрэнгүй харах
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
