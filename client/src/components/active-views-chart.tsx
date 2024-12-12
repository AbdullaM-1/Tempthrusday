import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { time: '00:00', views: 4000 },
  { time: '04:00', views: 3000 },
  { time: '08:00', views: 2000 },
  { time: '12:00', views: 2780 },
  { time: '16:00', views: 1890 },
  { time: '20:00', views: 2390 },
  { time: '23:59', views: 3490 },
]

export function ActiveViewsChart({ selectedChannels }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

