import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Check, X, Settings, BarChart3, Globe } from "lucide-react";
import { EventSourceManager } from "@/components/admin/EventSourceManager";
import { EventApproval } from "@/components/admin/EventApproval";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingCount, setPendingCount] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  // 시스템 설정 상태
  const [settings, setSettings] = useState({
    crawlInterval: 6, // 시간 단위
    maxConcurrent: 5,
    approvalNotify: true,
    errorNotify: true,
    adminEmails: [],
    customerNotify: false,
    customerEmails: [],
    notifyType: "email",
    notifyTriggers: ["approval_request", "error", "new_event"]
  });
  const [editSettings, setEditSettings] = useState(settings);
  const [settingsEditMode, setSettingsEditMode] = useState(false);

  // 승인대기 카운트 fetch
  const fetchPendingCount = async () => {
    const res = await fetch("http://localhost:3001/api/crawled-events?status=pending");
    const data = await res.json();
    setPendingCount(data.length);
  };
  // 전체 이벤트 수 fetch
  const fetchTotalEvents = async () => {
    const res = await fetch("http://localhost:3001/api/crawled-events");
    const data = await res.json();
    setTotalEvents(data.length);
  };
  useEffect(() => {
    fetchPendingCount();
    fetchTotalEvents();
  }, []);

  // 시스템 설정 fetch (예시: 서버에 /api/settings 엔드포인트 필요)
  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setEditSettings(data);
      }
    } catch {}
  };
  useEffect(() => { fetchSettings(); }, []);

  // 설정 저장
  const handleSaveSettings = async () => {
    const res = await fetch("http://localhost:3001/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSettings)
    });
    if (res.ok) {
      setSettings(editSettings);
      setSettingsEditMode(false);
      alert("설정이 저장되었습니다.");
    } else {
      alert("설정 저장 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">세모이 관리자</h1>
              <p className="mt-1 text-sm text-gray-600">
                이벤트 소스 및 콘텐츠 관리 대시보드
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                총 {totalEvents}개 이벤트
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                승인 대기 {pendingCount}개
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              대시보드
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              이벤트 소스
            </TabsTrigger>
            <TabsTrigger value="approval" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              승인 관리
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-5 text-xs">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              설정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <EventSourceManager />
          </TabsContent>

          <TabsContent value="approval" className="space-y-6">
            <EventApproval />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>시스템 설정</CardTitle>
                <CardDescription>
                  크롤링 및 시스템 동작 설정을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">크롤링 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">크롤링 주기</span>
                        {settingsEditMode ? (
                          <input type="number" min={1} max={24} value={editSettings.crawlInterval} onChange={e => setEditSettings(s => ({ ...s, crawlInterval: Number(e.target.value) }))} className="border rounded px-2 py-1 w-20" />
                        ) : (
                          <Badge variant="outline">{settings.crawlInterval}시간</Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">동시 크롤링 수</span>
                        {settingsEditMode ? (
                          <input type="number" min={1} max={20} value={editSettings.maxConcurrent} onChange={e => setEditSettings(s => ({ ...s, maxConcurrent: Number(e.target.value) }))} className="border rounded px-2 py-1 w-20" />
                        ) : (
                          <Badge variant="outline">{settings.maxConcurrent}개</Badge>
                        )}
                      </div>
                      {settingsEditMode ? (
                        <Button variant="default" size="sm" className="w-full mt-2" onClick={handleSaveSettings}>저장</Button>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setSettingsEditMode(true)}>설정 변경</Button>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">알림 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">알림 방식</span>
                        {settingsEditMode ? (
                          <select value={editSettings.notifyType} onChange={e => setEditSettings(s => ({ ...s, notifyType: e.target.value }))} className="border rounded px-2 py-1 w-32">
                            <option value="email">이메일</option>
                            <option value="sms">SMS</option>
                            <option value="kakao">카카오 알림톡</option>
                          </select>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            {settings.notifyType === "email" ? "이메일" : settings.notifyType === "sms" ? "SMS" : "카카오 알림톡"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">알림 트리거</span>
                        {settingsEditMode ? (
                          <div className="flex gap-2 flex-wrap">
                            <label className="flex items-center gap-1 text-xs">
                              <input type="checkbox" checked={editSettings.notifyTriggers.includes("approval_request")}
                                onChange={e => setEditSettings(s => ({ ...s, notifyTriggers: e.target.checked ? [...s.notifyTriggers, "approval_request"] : s.notifyTriggers.filter(t => t !== "approval_request") }))} /> 승인요청
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input type="checkbox" checked={editSettings.notifyTriggers.includes("error")}
                                onChange={e => setEditSettings(s => ({ ...s, notifyTriggers: e.target.checked ? [...s.notifyTriggers, "error"] : s.notifyTriggers.filter(t => t !== "error") }))} /> 오류
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input type="checkbox" checked={editSettings.notifyTriggers.includes("new_event")}
                                onChange={e => setEditSettings(s => ({ ...s, notifyTriggers: e.target.checked ? [...s.notifyTriggers, "new_event"] : s.notifyTriggers.filter(t => t !== "new_event") }))} /> 신규이벤트
                            </label>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-700">
                            {settings.notifyTriggers && settings.notifyTriggers.length > 0 ? settings.notifyTriggers.map(t =>
                              t === "approval_request" ? "승인요청" : t === "error" ? "오류" : t === "new_event" ? "신규이벤트" : t
                            ).join(", ") : "-"}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">관리자 이메일</span>
                        {settingsEditMode ? (
                          <input type="text" value={editSettings.adminEmails.join(",")} onChange={e => setEditSettings(s => ({ ...s, adminEmails: e.target.value.split(",").map(v => v.trim()).filter(Boolean) }))} className="border rounded px-2 py-1 w-56" placeholder="admin1@email.com,admin2@email.com" />
                        ) : (
                          <span className="text-xs text-gray-700">{settings.adminEmails && settings.adminEmails.length > 0 ? settings.adminEmails.join(", ") : "-"}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">고객 알림 활성화</span>
                        {settingsEditMode ? (
                          <input type="checkbox" checked={editSettings.customerNotify} onChange={e => setEditSettings(s => ({ ...s, customerNotify: e.target.checked }))} />
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">{settings.customerNotify ? "활성" : "비활성"}</Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">고객 이메일</span>
                        {settingsEditMode ? (
                          <input type="text" value={editSettings.customerEmails.join(",")} onChange={e => setEditSettings(s => ({ ...s, customerEmails: e.target.value.split(",").map(v => v.trim()).filter(Boolean) }))} className="border rounded px-2 py-1 w-56" placeholder="user1@email.com,user2@email.com" />
                        ) : (
                          <span className="text-xs text-gray-700">{settings.customerEmails && settings.customerEmails.length > 0 ? settings.customerEmails.join(", ") : "-"}</span>
                        )}
                      </div>
                      {settingsEditMode ? (
                        <Button variant="default" size="sm" className="w-full mt-2" onClick={handleSaveSettings}>저장</Button>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setSettingsEditMode(true)}>설정 변경</Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
