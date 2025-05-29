
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Globe, CheckCircle, AlertCircle, TrendingUp, Users } from "lucide-react";

export const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalEvents: 156,
    pendingApproval: 12,
    activeSources: 8,
    crawlingSuccess: 94,
    dailyViews: 2847,
    weeklyGrowth: 15.3
  };

  const recentActivity = [
    { id: 1, action: "새 이벤트 소스 추가", source: "서울시립미술관", time: "2시간 전", status: "success" },
    { id: 2, action: "이벤트 승인", source: "국립중앙박물관", time: "3시간 전", status: "success" },
    { id: 3, action: "크롤링 오류", source: "세종문화회관", time: "5시간 전", status: "error" },
    { id: 4, action: "새 이벤트 추가", source: "홍대 클럽", time: "6시간 전", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 이벤트 수</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.weeklyGrowth}%</span> 지난 주 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">
              검토가 필요한 이벤트
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 소스</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSources}</div>
            <p className="text-xs text-muted-foreground">
              크롤링 대상 웹사이트
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">크롤링 성공률</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.crawlingSuccess}%</div>
            <Progress value={stats.crawlingSuccess} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">일일 조회수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dailyViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              오늘 누적 조회수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">성장률</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.weeklyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              주간 사용자 증가율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>시스템에서 발생한 최근 활동들을 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    activity.status === 'success' ? 'default' :
                    activity.status === 'error' ? 'destructive' : 'secondary'
                  }>
                    {activity.status === 'success' ? '완료' :
                     activity.status === 'error' ? '오류' : '대기중'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
