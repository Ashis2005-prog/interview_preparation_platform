export const DiffBadge = ({ difficulty }) => {
  const map = {
    Easy:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Hard:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${map[difficulty] || ''}`}>
      {difficulty}
    </span>
  )
}

export const Badge = ({ text, color = 'default' }) => {
  const map = {
    default: 'bg-[#ede9ff] text-[#6c63ff] dark:bg-[#312e6b] dark:text-[#a78bfa]',
    green:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    orange:  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    red:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    yellow:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${map[color]}`}>
      {text}
    </span>
  )
}

export const ProgressBar = ({ value, max, color = '#6c63ff', height = 6 }) => (
  <div style={{ background: 'rgba(108,99,255,0.1)', borderRadius: 999, height, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(100, (value / (max || 1)) * 100)}%`, background: color, height: '100%', borderRadius: 999, transition: 'width 0.5s ease' }} />
  </div>
)
