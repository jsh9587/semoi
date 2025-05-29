
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Search, Star, TrendingUp, Clock, Heart } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [savedEvents, setSavedEvents] = useState<number[]>([]);

  const categories = ["전체", "음악", "미술", "기술", "음식", "스포츠", "교육", "축제"];

  const featuredEvents = [
    {
      id: 1,
      title: "서울 재즈 페스티벌 2025",
      date: "2025-06-15",
      time: "19:00",
      location: "올림픽공원 88잔디마당",
      category: "음악",
      price: "35,000원",
      image: "/placeholder.svg",
      attendees: 1250,
      rating: 4.8,
      description: "국내외 유명 재즈 아티스트들이 펼치는 환상적인 무대"
    },
    {
      id: 2,
      title: "AI & 머신러닝 컨퍼런스",
      date: "2025-06-20",
      time: "09:00",
      location: "코엑스 컨벤션센터",
      category: "기술",
      price: "무료",
      image: "/placeholder.svg",
      attendees: 850,
      rating: 4.9,
      description: "최신 AI 기술 동향과 실무 적용 사례를 다루는 전문 컨퍼런스"
    },
    {
      id: 3,
      title: "한강 피크닉 & 요가",
      date: "2025-06-18",
      time: "10:00",
      location: "한강공원 여의도지구",
      category: "스포츠",
      price: "15,000원",
      image: "/placeholder.svg",
      attendees: 45,
      rating: 4.7,
      description: "한강의 아름다운 풍경과 함께하는 힐링 요가 클래스"
    },
    {
      id: 4,
      title: "홍대 거리음식 투어",
      date: "2025-06-22",
      time: "18:00",
      location: "홍익대학교 인근",
      category: "음식",
      price: "25,000원",
      image: "/placeholder.svg",
      attendees: 32,
      rating: 4.6,
      description: "홍대 맛집들을 돌아보며 즐기는 특별한 푸드 투어"
    },
    {
      id: 5,
      title: "디지털 아트 전시회",
      date: "2025-06-25",
      time: "10:00",
      location: "동대문디자인플라자",
      category: "미술",
      price: "12,000원",
      image: "/placeholder.svg",
      attendees: 680,
      rating: 4.5,
      description: "최첨단 디지털 기술로 표현하는 현대 미술의 새로운 경험"
    },
    {
      id: 6,
      title: "창업 네트워킹 데이",
      date: "2025-06-28",
      time: "14:00",
      location: "강남 스타트업 허브",
      category: "교육",
      price: "무료",
      image: "/placeholder.svg",
      attendees: 120,
      rating: 4.8,
      description: "예비 창업가와 투자자들이 만나는 네트워킹 이벤트"
    }
  ];

  const trendingEvents = [
    { title: "K-POP 댄스 클래스", category: "음악", attendees: 890 },
    { title: "한강 선셋 요가", category: "스포츠", attendees: 234 },
    { title: "비건 쿠킹 클래스", category: "음식", attendees: 156 }
  ];

  const filteredEvents = featuredEvents.filter(event => {
    const matchesCategory = selectedCategory === "전체" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveEvent = (eventId: number) => {
    if (savedEvents.includes(eventId)) {
      setSavedEvents(savedEvents.filter(id => id !== eventId));
      toast.success("이벤트가 저장 목록에서 제거되었습니다");
    } else {
      setSavedEvents([...savedEvents, eventId]);
      toast.success("이벤트가 저장되었습니다");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 mr-2 text-yellow-300" />
            <span className="text-sm font-medium">세상 모든 이벤트를 한 곳에서</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            세모이
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto leading-relaxed">
            관심사에 맞는 완벽한 이벤트를 발견하세요.<br />
            음악, 미술, 기술, 음식까지 모든 경험이 여기에
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="어떤 이벤트를 찾고 계신가요?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-0 bg-white/95 backdrop-blur-sm shadow-lg text-gray-800 placeholder:text-gray-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-white text-purple-700 hover:bg-white/90"
                    : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-purple-200">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>6,842개 이벤트</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>일일 활성 사용자 12,500명</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>전국 모든 지역</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">6,842</div>
              <div className="text-gray-600">등록된 이벤트</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,234</div>
              <div className="text-gray-600">파트너 주최자</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-gray-600">사용자 만족도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">이벤트 카테고리</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Events Sidebar */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Events Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                  <Star className="w-8 h-8 mr-3 text-yellow-500" />
                  추천 이벤트
                </h2>
                <Button variant="outline" className="rounded-full">
                  전체 보기
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md hover:-translate-y-1">
                    <div className="relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSaveEvent(event.id)}
                        className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            savedEvents.includes(event.id) 
                              ? "fill-red-500 text-red-500" 
                              : "text-gray-600"
                          }`} 
                        />
                      </Button>
                      <Badge 
                        className="absolute top-3 left-3 bg-purple-600 hover:bg-purple-700"
                      >
                        {event.category}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                          {formatDate(event.date)} • {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {event.location}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-green-500" />
                            {event.attendees}명 관심
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                            {event.rating}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600">
                          {event.price}
                        </span>
                        <Button 
                          size="sm" 
                          className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          자세히 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trending Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                      지금 뜨는 이벤트
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trendingEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div>
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs text-gray-500">{event.category}</div>
                        </div>
                        <div className="text-xs text-gray-600 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {event.attendees}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      새로 올라온 이벤트
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 text-center py-4">
                      최신 이벤트 정보를
                      <br />
                      곧 업데이트할 예정입니다
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            관심사에 맞는 이벤트를 놓치지 마세요
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            회원가입하고 개인화된 추천을 받아보세요
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-3 font-semibold"
          >
            무료 회원가입
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">세모이</h3>
            <p className="text-gray-400 mb-6">세상 모든 이벤트를 한 곳에서</p>
            <div className="text-sm text-gray-500">
              © 2025 세모이. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
