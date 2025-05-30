import { useState, useEffect } from "react";
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
  // DB 연동용 상태
  const [sources, setSources] = useState([]);
  const [crawledEvents, setCrawledEvents] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    category: "",
    titleSelector: "",
    priceSelector: "",
    linkSelector: "",
    imageSelector: "",
    periodSelector: "",
    periodDataAttr: ""
  });
  const [editSource, setEditSource] = useState(null);

  // 소스 목록 불러오기
  const fetchSources = async () => {
    const res = await fetch("http://localhost:3001/api/event-sources");
    const data = await res.json();
    setSources(data);
  };
  useEffect(() => { fetchSources(); fetchCrawledEvents(); }, []);

  // 크롤링 결과 목록 불러오기
  const fetchCrawledEvents = async () => {
    const res = await fetch("http://localhost:3001/api/crawled-events");
    const data = await res.json();
    setCrawledEvents(data);
  };

  // 소스 추가
  const handleAddSource = async () => {
    const res = await fetch("http://localhost:3001/api/event-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSource)
    });
    if (res.ok) {
      setIsAddDialogOpen(false);
      setNewSource({ name: "", url: "", category: "", titleSelector: "", priceSelector: "", linkSelector: "", imageSelector: "", periodSelector: "", periodDataAttr: "" });
      fetchSources();
    }
  };

  // 소스 수정
  const handleEditSource = async () => {
    if (!editSource) return;
    const res = await fetch(`http://localhost:3001/api/event-sources/${editSource.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSource)
    });
    if (res.ok) {
      setEditSource(null);
      fetchSources();
    }
  };

  // 소스 삭제
  const handleDeleteSource = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`http://localhost:3001/api/event-sources/${id}`, { method: "DELETE" });
    if (res.ok) fetchSources();
  };

  // 크롤링 + DB 저장 (puppeteer 기반)
  const handleCrawlAndSave = async (source) => {
    const res = await fetch("http://localhost:3001/api/puppeteer-crawl-and-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceId: source.id,
        url: source.url,
        titleSelector: source.title_selector,
        priceSelector: source.price_selector,
        linkSelector: source.link_selector,
        imageSelector: source.image_selector,
        periodSelector: source.period_selector,
        periodDataAttr: source.period_data_attr
      })
    });
    const data = await res.json();
    if (data.success) {
      alert(`크롤링 및 저장 성공! 저장된 건수: ${data.count}`);
      fetchCrawledEvents();
    } else {
      alert("크롤링 실패: " + (data.error || "알 수 없음"));
    }
  };

  // 상태 뱃지
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'error': return <Badge variant="destructive">오류</Badge>;
      case 'pending': return <Badge variant="secondary">대기중</Badge>;
      default: return <Badge variant="outline">알 수 없음</Badge>;
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
              <div className="grid gap-2">
                <Label htmlFor="titleSelector">타이틀 CSS 선택자</Label>
                <Input
                  id="titleSelector"
                  value={newSource.titleSelector}
                  onChange={(e) => setNewSource({...newSource, titleSelector: e.target.value})}
                  placeholder="예: .event-title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priceSelector">가격 CSS 선택자</Label>
                <Input
                  id="priceSelector"
                  value={newSource.priceSelector}
                  onChange={(e) => setNewSource({...newSource, priceSelector: e.target.value})}
                  placeholder="예: .price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkSelector">링크 CSS 선택자</Label>
                <Input
                  id="linkSelector"
                  value={newSource.linkSelector}
                  onChange={(e) => setNewSource({...newSource, linkSelector: e.target.value})}
                  placeholder="예: .event-link"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageSelector">이미지 CSS 선택자</Label>
                <Input
                  id="imageSelector"
                  value={newSource.imageSelector}
                  onChange={(e) => setNewSource({...newSource, imageSelector: e.target.value})}
                  placeholder="예: .event-image"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="periodSelector">이벤트기간 CSS 선택자</Label>
                <Input
                  id="periodSelector"
                  value={newSource.periodSelector}
                  onChange={(e) => setNewSource({...newSource, periodSelector: e.target.value})}
                  placeholder="예: .event-period 또는 a.btn-link"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="periodDataAttr">이벤트기간 data attribute (선택)</Label>
                <Input
                  id="periodDataAttr"
                  value={newSource.periodDataAttr}
                  onChange={(e) => setNewSource({...newSource, periodDataAttr: e.target.value})}
                  placeholder="예: data-href"
                />
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
                      <Button variant="outline" size="sm" onClick={() => handleCrawlAndSave(source)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditSource(source)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSource(source.id)}>
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

      {/* 소스 수정 다이얼로그 */}
      {editSource && (
        <Dialog open={!!editSource} onOpenChange={() => setEditSource(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>이벤트 소스 수정</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">소스 이름</Label>
                <Input id="edit-name" value={editSource.name} onChange={e => setEditSource({ ...editSource, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-url">URL</Label>
                <Input id="edit-url" value={editSource.url} onChange={e => setEditSource({ ...editSource, url: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">카테고리</Label>
                <Input id="edit-category" value={editSource.category} onChange={e => setEditSource({ ...editSource, category: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-titleSelector">타이틀 CSS 선택자</Label>
                <Input id="edit-titleSelector" value={editSource.title_selector} onChange={e => setEditSource({ ...editSource, title_selector: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-priceSelector">가격 CSS 선택자</Label>
                <Input id="edit-priceSelector" value={editSource.price_selector} onChange={e => setEditSource({ ...editSource, price_selector: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-linkSelector">링크 CSS 선택자</Label>
                <Input id="edit-linkSelector" value={editSource.link_selector} onChange={e => setEditSource({ ...editSource, link_selector: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-imageSelector">이미지 CSS 선택자</Label>
                <Input id="edit-imageSelector" value={editSource.image_selector} onChange={e => setEditSource({ ...editSource, image_selector: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-periodSelector">이벤트기간 CSS 선택자</Label>
                <Input id="edit-periodSelector" value={editSource.period_selector} onChange={e => setEditSource({ ...editSource, period_selector: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-periodDataAttr">이벤트기간 data attribute</Label>
                <Input id="edit-periodDataAttr" value={editSource.period_data_attr} onChange={e => setEditSource({ ...editSource, period_data_attr: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditSource(null)}>취소</Button>
              <Button onClick={handleEditSource}>저장</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 크롤링 결과 목록 테이블 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>크롤링 결과 목록</CardTitle>
          <CardDescription>최근 크롤링된 이벤트 데이터 (최대 100건)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>소스ID</TableHead>
                <TableHead>타이틀</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>링크</TableHead>
                <TableHead>이미지</TableHead>
                <TableHead>이벤트기간</TableHead>
                <TableHead>크롤링시각</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crawledEvents.map(ev => (
                <TableRow key={ev.id}>
                  <TableCell>{ev.source_id}</TableCell>
                  <TableCell>{ev.title}</TableCell>
                  <TableCell>{ev.price}</TableCell>
                  <TableCell><a href={ev.link} target="_blank" rel="noopener noreferrer">{ev.link}</a></TableCell>
                  <TableCell>{ev.image ? <img src={ev.image} alt="img" style={{width:60}} /> : null}</TableCell>
                  <TableCell>{ev.period}</TableCell>
                  <TableCell>{ev.crawled_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
