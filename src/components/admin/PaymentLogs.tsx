
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";

const PaymentLogs = () => {
  const transactions = [
    {
      id: "TXN-001",
      user: "John Doe",
      amount: "$5.00",
      type: "payment",
      status: "completed",
      date: "2024-01-20",
      post: "AI in Content Marketing"
    },
    {
      id: "TXN-002",
      user: "Jane Smith",
      amount: "$5.00",
      type: "payment",
      status: "completed",
      date: "2024-01-18",
      post: "Health Habits Guide"
    },
    {
      id: "REF-001",
      user: "Mike Johnson",
      amount: "$5.00",
      type: "refund",
      status: "processed",
      date: "2024-01-15",
      post: "Remote Work Guide"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processed": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Logs</CardTitle>
        <CardDescription>View all payment transactions and financial reports</CardDescription>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Financial Report
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Post Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono">{transaction.id}</TableCell>
                <TableCell>{transaction.user}</TableCell>
                <TableCell className="max-w-xs truncate">{transaction.post}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === "payment" ? "default" : "secondary"}>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{transaction.amount}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentLogs;
