
import { useState } from "react";
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

  // Mock data for pending approvals
  const pendingCount = 12;
  const sourcesCount = 8;
  const totalEvents = 156;

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
                        <Badge variant="outline">6시간</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">동시 크롤링 수</span>
                        <Badge variant="outline">5개</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        설정 변경
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">알림 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">승인 요청 알림</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">활성</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">오류 알림</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">활성</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        설정 변경
                      </Button>
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
