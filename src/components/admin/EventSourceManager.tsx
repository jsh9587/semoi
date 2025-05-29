
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Globe, CheckCircle, XCircle, RefreshCw, Trash2, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const EventSourceManager = () => {
  const [sources, setSources] = useState([
    {
      id: 1,
      name: "서울시립미술관",
      url: "https://sema.seoul.go.kr/kr/exhibition",
      category: "미술/전시",
      status: "active",
      lastCrawled: "2025-01-20 14:30",
      successRate: 98
    },
    {
      id: 2,
      name: "국립중앙박물관",
      url: "https://www.museum.go.kr/site/main/exhiSpecialTheme",
      category: "박물관",
      status: "active",
      lastCrawled: "2025-01-20 14:25",
      successRate: 95
    },
    {
      id: 3,
      name: "세종문화회관",
      url: "https://www.sejongpac.or.kr/portal/performance",
      category: "공연/음악",
      status: "error",
      lastCrawled: "2025-01-20 13:45",
      successRate: 87
    },
    {
      id: 4,
      name: "홍대 클럽",
      url: "https://hongdae-club.com/events",
      category: "클럽/파티",
      status: "pending",
      lastCrawled: "-",
      successRate: 0
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    category: ""
  });

  const handleAddSource = () => {
    if (newSource.name && newSource.url && newSource.category) {
      const newId = Math.max(...sources.map(s => s.id)) + 1;
      setSources([...sources, {
        id: newId,
        ...newSource,
        status: "pending",
        lastCrawled: "-",
        successRate: 0
      }]);
      setNewSource({ name: "", url: "", category: "" });
      setIsAddDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'error':
        return <Badge variant="destructive">오류</Badge>;
      case 'pending':
        return <Badge variant="secondary">대기중</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">이벤트 소스 관리</h2>
          <p className="text-gray-600 mt-1">크롤링 대상 웹사이트를 관리합니다.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              새 소스 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 이벤트 소스 추가</DialogTitle>
              <DialogDescription>
                크롤링할 새로운 이벤트 소스를 추가합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">소스 이름</Label>
                <Input
                  id="name"
                  value={newSource.name}
                  onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                  placeholder="예: 서울시립미술관"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newSource.url}
                  onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                  placeholder="https://example.com/events"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리</Label>
                <Select onValueChange={(value) => setNewSource({...newSource, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="미술/전시">미술/전시</SelectItem>
                    <SelectItem value="공연/음악">공연/음악</SelectItem>
                    <SelectItem value="박물관">박물관</SelectItem>
                    <SelectItem value="클럽/파티">클럽/파티</SelectItem>
                    <SelectItem value="교육/세미나">교육/세미나</SelectItem>
                    <SelectItem value="스포츠">스포츠</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleAddSource}>
                추가
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>등록된 소스 목록</CardTitle>
          <CardDescription>
            현재 크롤링 중인 이벤트 소스들의 상태를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>소스 이름</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 크롤링</TableHead>
                <TableHead>성공률</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{source.name}</p>
                      <p className="text-sm text-gray-500">{source.url}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{source.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(source.status)}
                  </TableCell>
                  <TableCell>{source.lastCrawled}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{source.successRate}%</span>
                      {source.successRate >= 95 && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {source.successRate < 90 && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
