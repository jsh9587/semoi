import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit, Calendar, MapPin, Clock, User } from "lucide-react";

export const EventApproval = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // 승인 대기 이벤트 목록 불러오기
  const fetchPendingEvents = async () => {
    const res = await fetch("http://localhost:3001/api/crawled-events?status=pending");
    const data = await res.json();
    setPendingEvents(data);
  };
  useEffect(() => { fetchPendingEvents(); }, []);

  // 승인
  const handleApprove = async (eventId: number) => {
    const event = pendingEvents.find(ev => ev.id === eventId);
    if (!event) return;
    await fetch(`http://localhost:3001/api/crawled-events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, status: "approved" })
    });
    fetchPendingEvents();
  };

  // 거절
  const handleReject = async (eventId: number) => {
    const event = pendingEvents.find(ev => ev.id === eventId);
    if (!event) return;
    await fetch(`http://localhost:3001/api/crawled-events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, status: "rejected" })
    });
    fetchPendingEvents();
  };

  // 수정 모드 진입
  const handleEdit = (eventId: number) => {
    setEditingEvent(editingEvent === eventId ? null : eventId);
    const event = pendingEvents.find(ev => ev.id === eventId);
    setEditForm(event || {});
  };

  // 전체 승인
  const handleApproveAll = async () => {
    for (const event of pendingEvents) {
      if (!event.title || !event.link) {
        alert(`필수값(제목, 링크)이 비어있는 이벤트가 있습니다. 먼저 수정해 주세요.`);
        return;
      }
    }
    await Promise.all(pendingEvents.map(event =>
      fetch(`http://localhost:3001/api/crawled-events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, status: "approved" })
      })
    ));
    fetchPendingEvents();
  };

  // 수정 저장
  const handleSaveEdit = async () => {
    if (!editingEvent) return;
    if (!editForm.title || !editForm.link) {
      alert("제목과 링크는 필수입니다.");
      return;
    }
    await fetch(`http://localhost:3001/api/crawled-events/${editingEvent}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, status: "pending" })
    });
    setEditingEvent(null);
    fetchPendingEvents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">이벤트 승인 관리</h2>
        <p className="text-gray-600 mt-1">크롤링된 이벤트들을 검토하고 승인합니다.</p>
      </div>

      {/* Pending Events */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="default" onClick={handleApproveAll} disabled={pendingEvents.length === 0}>
            전체 승인
          </Button>
        </div>
        {pendingEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">모든 이벤트가 처리되었습니다</h3>
              <p className="text-gray-600">승인 대기 중인 이벤트가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          pendingEvents.map((event) => (
            <Card key={event.id} className="border-l-4 border-l-yellow-400">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {event.organizer}
                      </span>
                      <Badge variant="outline">{event.category}</Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event.id)}
                      className="text-blue-600 border-blue-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(event.id)}
                      className="text-green-600 border-green-200"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(event.id)}
                      className="text-red-600 border-red-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingEvent === event.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">제목</label>
                      <Input value={editForm.title || ""} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">설명</label>
                      <Textarea value={editForm.description || ""} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">날짜</label>
                        <Input value={editForm.date || ""} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">시간</label>
                        <Input value={editForm.time || ""} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">장소</label>
                      <Input value={editForm.location || ""} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">카테고리</label>
                      <Input value={editForm.category || ""} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">가격</label>
                      <Input value={editForm.price || ""} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">이미지</label>
                      <Input value={editForm.image || ""} onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">링크</label>
                      <Input value={editForm.link || ""} onChange={e => setEditForm(f => ({ ...f, link: e.target.value }))} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingEvent(null)}>
                        취소
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm space-y-1">
                        <div><strong>가격:</strong> {event.price}</div>
                        <div><strong>소스:</strong> <span className="text-blue-600">{event.source}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
