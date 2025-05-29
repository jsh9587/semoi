
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br />
            세모이에서 다양한 이벤트를 탐색해보세요!
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full"
          >
            <a href="/" className="flex items-center justify-center">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="w-full rounded-full"
          >
            <a href="/" className="flex items-center justify-center">
              <Search className="w-4 h-4 mr-2" />
              이벤트 탐색하기
            </a>
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>© 2025 세모이. 세상 모든 이벤트를 한 곳에서</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
