import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const orders = [
  { id: 1, title: "Top 10 Travel Destinations", status: "In Progress", dueDate: "2023-07-15" },
  { id: 2, title: "5 Easy DIY Home Decor Ideas", status: "Pending", dueDate: "2023-07-20" },
  { id: 3, title: "Beginner's Guide to Yoga", status: "Completed", dueDate: "2023-07-10" },
]

export function VideoProductionOrders({ selectedChannels }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.title}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.dueDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

