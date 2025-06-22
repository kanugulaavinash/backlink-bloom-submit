
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Check, X, Eye } from "lucide-react";

const ValidationQueue = () => {
  const flaggedPosts = [
    {
      id: 1,
      title: "Cryptocurrency Investment Guide",
      author: "Alex Wilson",
      issue: "API Timeout",
      type: "plagiarism_check",
      severity: "medium",
      submittedDate: "2024-01-20"
    },
    {
      id: 2,
      title: "Digital Marketing Trends",
      author: "Sarah Davis",
      issue: "High AI Score (22%)",
      type: "ai_detection",
      severity: "high",
      submittedDate: "2024-01-19"
    },
    {
      id: 3,
      title: "Social Media Strategy",
      author: "Tom Brown",
      issue: "Backlink Count (3 found)",
      type: "backlink_validation",
      severity: "low",
      submittedDate: "2024-01-18"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Validation Queue
        </CardTitle>
        <CardDescription>Posts flagged for manual review due to validation issues</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flaggedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate">{post.title}</div>
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.issue}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {post.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(post.severity)}>
                    {post.severity}
                  </Badge>
                </TableCell>
                <TableCell>{post.submittedDate}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-600">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ValidationQueue;
