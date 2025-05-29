
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit, Calendar, MapPin, Clock, User } from "lucide-react";

export const EventApproval = () => {
  const [pendingEvents, setPendingEvents] = useState([
    {
      id: 1,
      title: "현대미술 특별전: 디지털 아트의 미래",
      description: "최신 디지털 아트 작품들을 만나볼 수 있는 특별 전시회입니다. VR과 AI를 활용한 혁신적인 작품들이 전시됩니다.",
      date: "2025-02-15",
      time: "10:00",
      location: "서울시립미술관 본관",
      organizer: "서울시립미술관",
      source: "https://sema.seoul.go.kr/kr/exhibition",
      category: "미술/전시",
      price: "성인 5,000원",
      image: "/placeholder.svg",
      status: "pending"
    },
    {
      id: 2,
      title: "클래식 음악회: 베토벤 교향곡 9번",
      description: "서울시향이 연주하는 베토벤의 교향곡 9번 '합창'을 감상할 수 있는 특별한 기회입니다.",
      date: "2025-02-20",
      time: "19:30",
      location: "세종문화회관 대극장",
      organizer: "서울시향",
      source: "https://sejongpac.or.kr",
      category: "공연/음악",
      price: "R석 80,000원",
      image: "/placeholder.svg",
      status: "pending"
    },
    {
      id: 3,
      title: "홍대 일렉트로닉 파티",
      description: "최고의 DJ들이 참여하는 일렉트로닉 음악 파티입니다. 밤새도록 춤추며 즐겨보세요!",
      date: "2025-02-22",
      time: "22:00",
      location: "홍대 클럽 오케이",
      organizer: "클럽 오케이",
      source: "https://hongdae-club.com",
      category: "클럽/파티",
      price: "입장료 20,000원",
      image: "/placeholder.svg",
      status: "pending"
    }
  ]);

  const [editingEvent, setEditingEvent] = useState<number | null>(null);

  const handleApprove = (eventId: number) => {
    setPendingEvents(events => 
      events.filter(event => event.id !== eventId)
    );
  };

  const handleReject = (eventId: number) => {
    setPendingEvents(events => 
      events.filter(event => event.id !== eventId)
    );
  };

  const handleEdit = (eventId: number) => {
    setEditingEvent(editingEvent === eventId ? null : eventId);
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
                      <Input defaultValue={event.title} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">설명</label>
                      <Textarea defaultValue={event.description} rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">날짜</label>
                        <Input defaultValue={event.date} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">시간</label>
                        <Input defaultValue={event.time} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">장소</label>
                      <Input defaultValue={event.location} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingEvent(null)}>
                        취소
                      </Button>
                      <Button onClick={() => setEditingEvent(null)}>
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
