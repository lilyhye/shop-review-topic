import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  AreaChart, Area,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  Truck, 
  Smartphone, 
  HeartPulse, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  ChevronRight,
  Info,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Preparation ---

const TOPIC_DATA = {
  skincare: {
    title: "Topic 0: 뷰티 및 스킨케어 (달바 선크림)",
    keywords: [
      { name: "발림성", value: 49.8 },
      { name: "촉촉함", value: 49.2 },
      { name: "톤업효과", value: 37.8 },
      { name: "자연스러움", value: 28.3 },
      { name: "부드러움", value: 32.7 }
    ],
    sentiment: [
      { name: "긍정", value: 85 },
      { name: "중립", value: 10 },
      { name: "부정", value: 5 }
    ],
    radar: [
      { subject: '발림성', A: 95, fullMark: 100 },
      { subject: '수분감', A: 90, fullMark: 100 },
      { subject: '톤업', A: 85, fullMark: 100 },
      { subject: '지속력', A: 75, fullMark: 100 },
      { subject: '가격', A: 65, fullMark: 100 },
    ],
    trend: [
      { month: '1월', count: 400 },
      { month: '2월', count: 450 },
      { month: '3월', count: 600 },
      { month: '4월', count: 550 },
      { month: '5월', count: 700 },
    ],
    comparison: [
      { name: '달바', score: 92 },
      { name: '타사A', score: 78 },
      { name: '타사B', score: 82 },
    ]
  },
  supplements: {
    title: "Topic 1 & 4: 건강기능식품 (오메가3)",
    keywords: [
      { name: "가성비", value: 17.2 },
      { name: "비린내", value: 5.1 },
      { name: "배송속도", value: 18.5 },
      { name: "재구매", value: 4.6 },
      { name: "스포츠리서치", value: 12.2 }
    ],
    sentiment: [
      { name: "긍정", value: 78 },
      { name: "중립", value: 15 },
      { name: "부정", value: 7 }
    ],
    radar: [
      { subject: '가성비', A: 90, fullMark: 100 },
      { subject: '냄새(무취)', A: 85, fullMark: 100 },
      { subject: '함량', A: 80, fullMark: 100 },
      { subject: '배송', A: 95, fullMark: 100 },
      { subject: '브랜드', A: 70, fullMark: 100 },
    ],
    trend: [
      { month: '1월', count: 300 },
      { month: '2월', count: 320 },
      { month: '3월', count: 350 },
      { month: '4월', count: 400 },
      { month: '5월', count: 420 },
    ],
    comparison: [
      { name: '스포츠리서치', score: 88 },
      { name: '국산A', score: 75 },
      { name: '해외B', score: 80 },
    ]
  },
  tech: {
    title: "Topic 3: 테크 및 가전 (에어팟 프로)",
    keywords: [
      { name: "노이즈캔슬링", value: 30.2 },
      { name: "음질", value: 25.3 },
      { name: "착용감", value: 21.2 },
      { name: "연동성", value: 19.6 },
      { name: "디자인", value: 18.8 }
    ],
    sentiment: [
      { name: "긍정", value: 92 },
      { name: "중립", value: 5 },
      { name: "부정", value: 3 }
    ],
    radar: [
      { subject: '노캔성능', A: 98, fullMark: 100 },
      { subject: '음질', A: 85, fullMark: 100 },
      { subject: '배터리', A: 80, fullMark: 100 },
      { subject: '연동성', A: 95, fullMark: 100 },
      { subject: '가격', A: 50, fullMark: 100 },
    ],
    trend: [
      { month: '1월', count: 500 },
      { month: '2월', count: 480 },
      { month: '3월', count: 520 },
      { month: '4월', count: 600 },
      { month: '5월', count: 650 },
    ],
    comparison: [
      { name: '에어팟프로', score: 95 },
      { name: '소니', score: 90 },
      { name: '버즈', score: 85 },
    ]
  },
  logistics: {
    title: "Topic 2: 물류 및 서비스 만족도",
    keywords: [
      { name: "배송속도", value: 70.5 },
      { name: "저렴함", value: 60.8 },
      { name: "친절함", value: 51.9 },
      { name: "포장상태", value: 32.3 },
      { name: "정확성", value: 30.2 }
    ],
    sentiment: [
      { name: "긍정", value: 88 },
      { name: "중립", value: 8 },
      { name: "부정", value: 4 }
    ],
    radar: [
      { subject: '배송속도', A: 98, fullMark: 100 },
      { subject: '가격', A: 90, fullMark: 100 },
      { subject: 'CS응대', A: 80, fullMark: 100 },
      { subject: '포장', A: 85, fullMark: 100 },
      { subject: '정확도', A: 95, fullMark: 100 },
    ],
    trend: [
      { month: '1월', count: 800 },
      { month: '2월', count: 850 },
      { month: '3월', count: 900 },
      { month: '4월', count: 950 },
      { month: '5월', count: 1000 },
    ],
    comparison: [
      { name: '자사몰', score: 90 },
      { name: '쿠팡', score: 95 },
      { name: '네이버', score: 88 },
    ]
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- Components ---

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon: any }) => (
  <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
    <div className="p-2 bg-indigo-600 rounded-lg text-white">
      <Icon size={24} />
    </div>
    <h2 className="text-2xl font-bold text-gray-800">{children}</h2>
  </div>
);

const Card = ({ title, children, description }: { title: string, children: React.ReactNode, description: string }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <BarChart3 size={18} className="text-indigo-500" />
      {title}
    </h3>
    <div className="flex-grow min-h-[250px]">
      {children}
    </div>
    <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-400">
      <p className="text-sm text-gray-600 leading-relaxed">
        <span className="font-bold text-indigo-700">분석 설명:</span> {description}
      </p>
    </div>
  </div>
);

const InsightBox = ({ title, content }: { title: string, content: string }) => (
  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 mb-6">
    <div className="flex items-center gap-2 mb-3 text-indigo-700">
      <Lightbulb size={20} />
      <h4 className="font-bold text-lg">{title}</h4>
    </div>
    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
  </div>
);

const ActionPlanBox = ({ title, content }: { title: string, content: string }) => (
  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
    <div className="flex items-center gap-2 mb-3 text-emerald-700">
      <Rocket size={20} />
      <h4 className="font-bold text-lg">{title}</h4>
    </div>
    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
  </div>
);

const WordCloud = ({ words }: { words: { name: string, value: number }[] }) => {
  const max = Math.max(...words.map(w => w.value));
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 h-full p-4">
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            fontSize: `${Math.max(14, (word.value / max) * 40)}px`,
            color: COLORS[i % COLORS.length],
            opacity: 0.7 + (word.value / max) * 0.3,
            fontWeight: word.value > max * 0.5 ? 'bold' : 'normal'
          }}
          className="transition-all hover:scale-110 cursor-default"
        >
          {word.name}
        </span>
      ))}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'skincare' | 'supplements' | 'tech' | 'logistics'>('skincare');

  const currentData = TOPIC_DATA[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight">Insight Dashboard Pro</h1>
          </div>
          <nav className="hidden md:flex gap-1">
            {Object.entries(TOPIC_DATA).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === key 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {data.title.split(':')[0]}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Topic Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectionTitle icon={
            activeTab === 'skincare' ? ShoppingBag :
            activeTab === 'supplements' ? HeartPulse :
            activeTab === 'tech' ? Smartphone : Truck
          }>
            {currentData.title}
          </SectionTitle>

          {/* Top Row: Word Cloud & Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card 
              title="키워드 워드클라우드" 
              description="해당 토픽에서 가장 빈번하게 등장하는 핵심 키워드들을 시각화한 워드클라우드입니다. 글자의 크기는 키워드의 가중치(Weight)를 나타내며, 이를 통해 소비자들이 해당 제품군에서 어떤 속성을 가장 중요하게 생각하는지 한눈에 파악할 수 있습니다. 예를 들어 스킨케어에서는 '발림성'과 '촉촉함'이 압도적인 비중을 차지하고 있음을 알 수 있으며, 이는 제품 선택의 결정적 요인임을 시사합니다."
            >
              <WordCloud words={currentData.keywords} />
            </Card>
            <Card 
              title="속성별 레이더 차트" 
              description="제품의 주요 5가지 속성에 대한 소비자 만족도 및 중요도를 레이더 차트로 분석한 결과입니다. 각 축은 제품의 핵심 경쟁력을 나타내며, 면적이 넓을수록 전반적인 균형이 잘 잡힌 제품임을 의미합니다. 테크 제품의 경우 '노이즈캔슬링'과 '연동성' 축에서 매우 높은 점수를 기록하고 있으나, '가격' 축에서는 상대적으로 낮은 점수를 보여 프리미엄 전략에 따른 소비자 부담감이 존재함을 정량적으로 확인할 수 있습니다."
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentData.radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="만족도" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Middle Row: Bar & Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card 
              title="키워드 가중치 분석 (Top 5)" 
              description="LDA 분석을 통해 도출된 상위 5개 키워드의 수치적 가중치를 막대 그래프로 표현하였습니다. 수치가 높을수록 해당 토픽을 정의하는 핵심적인 단어임을 뜻합니다. 건강기능식품 토픽에서는 '가성비'와 '배송속도'가 높은 수치를 기록하고 있는데, 이는 소비자들이 영양제 구매 시 브랜드의 명성보다는 실질적인 가격 혜택과 빠른 수령 가능 여부를 더 민감하게 고려하고 있다는 시장의 흐름을 명확하게 보여주는 지표입니다."
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData.keywords} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card 
              title="소비자 감성 분포" 
              description="리뷰 데이터의 텍스트 마이닝을 통해 분류된 긍정, 중립, 부정 감성의 비율을 나타내는 파이 차트입니다. 전체적인 여론의 향방을 결정짓는 중요한 지표로 활용됩니다. 대부분의 토픽에서 긍정 비율이 80% 이상으로 높게 나타나고 있으나, 부정적인 5~7%의 의견들을 심층 분석하면 제품의 개선점이나 잠재적인 리스크 요인을 조기에 발견할 수 있습니다. 특히 배송 관련 토픽에서의 부정 의견은 주로 '포장 파손' 이슈와 연결되는 경향이 있습니다."
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.sentiment}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentData.sentiment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Bottom Row: Trend & Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card 
              title="월별 언급량 추이" 
              description="최근 5개월간 해당 토픽과 관련된 소비자 언급량의 변화를 나타내는 영역 차트입니다. 특정 시점의 급격한 상승은 신제품 출시, 대규모 프로모션, 혹은 계절적 요인에 의한 수요 증가를 의미합니다. 스킨케어 제품의 경우 날씨가 건조해지는 시점에 언급량이 가파르게 상승하는 패턴을 보이며, 이는 마케팅 캠페인의 시점을 결정하는 중요한 근거 데이터가 됩니다. 추세선을 통해 향후 시장의 관심도를 예측하고 재고 관리 전략을 수립할 수 있습니다."
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card 
              title="경쟁사 대비 브랜드 지수" 
              description="주요 경쟁 브랜드들과의 소비자 선호도 및 브랜드 지수를 비교 분석한 막대 그래프입니다. 자사 브랜드가 시장 내에서 어느 정도의 위치를 점유하고 있는지 객관적으로 평가할 수 있습니다. 에어팟 프로의 경우 경쟁사 제품들보다 압도적인 브랜드 점수를 유지하고 있는데, 이는 단순한 기능적 우위를 넘어선 강력한 브랜드 로열티와 생태계의 힘이 작용하고 있음을 보여줍니다. 경쟁사들의 점수 변화를 모니터링하여 시장 점유율 방어 전략을 고도화할 필요가 있습니다."
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData.comparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Insights & Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InsightBox 
              title="비즈니스 인사이트 도출" 
              content={
                activeTab === 'skincare' ? 
                "스킨케어 시장에서 소비자들은 단순한 자외선 차단 기능을 넘어 '발림성'과 '톤업'이라는 부가적인 가치에 매우 민감하게 반응하고 있습니다. 특히 '달바' 브랜드의 경우, 촉촉한 수분감과 자연스러운 피부 보정 효과가 강력한 구매 동기로 작용하고 있음이 데이터로 증명되었습니다. 소비자들이 '부드럽게 발린다'는 경험을 긍정적인 감정의 핵심으로 꼽고 있는 만큼, 텍스처의 혁신이 곧 시장 점유율 확대로 이어질 수 있는 구조입니다. 또한 톤업 기능에 대한 높은 만족도는 파운데이션 프리(Foundation-free) 트렌드와 맞물려 향후 메이크업 베이스 시장까지 확장 가능한 잠재력을 시사합니다. 이러한 소비자 니즈를 반영하여 제품의 제형적 특성을 더욱 강조하는 전략이 유효할 것으로 판단됩니다." :
                activeTab === 'supplements' ?
                "건강기능식품, 특히 오메가3 시장의 핵심 키워드는 '비린내 제거'와 '가성비'로 요약됩니다. 소비자들은 제품의 효능만큼이나 섭취 시의 불쾌감을 최소화하는 것을 중요하게 생각하며, '스포츠리서치'와 같은 해외 유명 브랜드의 가성비 제품에 대한 충성도가 높게 나타납니다. 특히 비린내에 대한 부정적 언급이 재구매를 막는 가장 큰 장애물로 파악되었으며, 이를 해결한 제품들이 시장에서 독보적인 위치를 차지하고 있습니다. 또한 배송 속도에 대한 민감도가 타 카테고리 대비 높게 나타나는 것은 영양제 섭취의 연속성을 중시하는 소비자 특성을 반영합니다. 따라서 가격 경쟁력을 유지하면서도 섭취 편의성을 극대화한 제품 설계와 물류 최적화가 시장 성공의 핵심 열쇠가 될 것입니다." :
                activeTab === 'tech' ?
                "테크 분야에서 에어팟 프로의 성공은 '노이즈캔슬링'이라는 핵심 기능의 완벽한 구현과 애플 생태계 내에서의 '연동성'에 기반하고 있습니다. 소비자들은 높은 가격대에도 불구하고 압도적인 성능적 만족감을 바탕으로 프리미엄 가격을 기꺼이 지불하고 있습니다. 특히 '노캔'이라는 줄임말이 보편화될 정도로 해당 기능은 무선 이어폰의 필수 덕목이 되었으며, 소비자들은 일상 속의 소음 차단을 통한 몰입 경험에 높은 가치를 부여하고 있습니다. 다만, 배터리 수명이나 가격에 대한 소수의 아쉬움 섞인 목소리는 향후 경쟁사들이 파고들 수 있는 틈새 시장이 될 수 있습니다. 강력한 브랜드 파워를 유지하기 위해서는 기능적 우위를 지속적으로 확보함과 동시에, 사용자 경험(UX)의 사소한 불편함까지 세심하게 케어하는 디테일한 접근이 요구됩니다." :
                "물류 및 서비스 토픽 분석 결과, 현대 이커머스 시장에서 '배송 속도'는 더 이상 차별화 요소가 아닌 기본값이 되었음을 알 수 있습니다. 소비자들은 '빠르고 정확한 배송'에 대해 매우 높은 만족도를 보이며, 이는 브랜드에 대한 신뢰도로 직결됩니다. 특히 '저렴하게'와 '배송도'라는 키워드가 밀접하게 연관되어 나타나는 것은, 소비자들이 가격 혜택과 물류 서비스의 질을 동시에 기대하고 있음을 의미합니다. 포장 상태에 대한 긍정적인 언급은 제품 수령 시의 첫인상이 브랜드 이미지 형성에 큰 영향을 미친다는 것을 시사합니다. 따라서 물류 프로세스의 효율화뿐만 아니라, 고객과의 접점인 CS 응대와 배송 패키징의 퀄리티를 높이는 것이 고객 생애 가치(LTV)를 증대시키고 경쟁사로의 이탈을 방지하는 가장 확실한 전략이 될 것입니다."
              }
            />
            <ActionPlanBox 
              title="비즈니스 액션 플랜" 
              content={
                activeTab === 'skincare' ?
                "첫째, '수분 톤업'이라는 키워드를 중심으로 한 디지털 마케팅 캠페인을 강화해야 합니다. 인플루언서와의 협업 시 제품의 발림성을 시각적으로 보여줄 수 있는 숏폼 콘텐츠를 제작하여 텍스처의 우수성을 강조합니다. 둘째, 톤업 효과의 자연스러움을 강조하기 위해 다양한 피부 톤에서의 전후 비교 데이터를 상세 페이지에 전면 배치하여 신뢰도를 높입니다. 셋째, 재구매율을 높이기 위해 정기 구독 서비스를 도입하고, 공병 수거 캠페인 등을 통해 브랜드 로열티를 강화하는 ESG 마케팅을 병행합니다. 마지막으로, 선크림 외에도 동일한 제형 기술을 적용한 수분 크림이나 베이스 메이크업 라인업을 확장하여 고객당 구매 단가를 높이는 크로스셀링 전략을 실행함으로써 매출 성장을 가속화해야 합니다." :
                activeTab === 'supplements' ?
                "첫째, 제품 패키징에 '비린내 0%' 혹은 '특수 코팅 기술 적용'을 명확하게 표기하여 소비자들의 가장 큰 우려 사항을 선제적으로 해소합니다. 둘째, '스포츠리서치' 등 경쟁사 대비 가격 경쟁력을 확보하기 위해 대용량 번들 상품을 기획하고, 첫 구매 고객 대상 파격 할인 혜택을 제공하여 신규 유입을 극대화합니다. 셋째, 물류 거점을 다변화하여 '당일 배송' 혹은 '새벽 배송' 가능 지역을 확대함으로써 배송 만족도를 극대화합니다. 넷째, 영양제 섭취를 잊지 않도록 돕는 모바일 알림 서비스나 챌린지 프로그램을 운영하여 고객의 건강 관리 파트너로서의 입지를 굳힙니다. 이러한 다각도의 접근을 통해 가성비 중심의 시장에서 강력한 브랜드 팬덤을 구축하고 장기적인 수익성을 확보해 나갈 것입니다." :
                activeTab === 'tech' ?
                "첫째, 노이즈캔슬링 성능을 극대화할 수 있는 펌웨어 업데이트를 정기적으로 시행하고 이를 사용자들에게 적극적으로 홍보하여 사후 지원의 우수성을 강조합니다. 둘째, 프리미엄 이미지를 유지하면서도 진입 장벽을 낮추기 위해 구형 모델 보상 판매 프로그램(Trade-in)을 강화하여 기존 사용자들의 기기 변경을 유도합니다. 셋째, 오프라인 체험 매장을 확대하여 소비자들이 직접 노이즈캔슬링의 성능을 체감할 수 있는 기회를 늘리고, 현장에서의 전문적인 상담을 통해 구매 전환율을 높입니다. 넷째, 전문 오디오 커뮤니티와의 협업을 통해 기술적 깊이가 있는 리뷰 콘텐츠를 양산함으로써 전문가 집단에서의 입지를 공고히 합니다. 기술적 리더십과 고객 케어의 조화를 통해 시장 지배력을 더욱 공고히 다지는 전략을 추진하겠습니다." :
                "첫째, AI 기반의 수요 예측 시스템을 고도화하여 재고 부족으로 인한 배송 지연을 원천 차단하고 물류 효율성을 20% 이상 개선합니다. 둘째, 친환경 포장재 도입을 통해 '착한 배송' 이미지를 구축하고, 포장 파손율을 줄이기 위한 패키징 설계를 강화하여 고객 불만을 최소화합니다. 셋째, CS 응대 매뉴얼을 고도화하고 챗봇 시스템을 도입하여 고객 문의에 대한 실시간 대응 체계를 구축함으로써 서비스 만족도를 높입니다. 넷째, 배송 완료 후 고객의 피드백을 즉각적으로 수집할 수 있는 시스템을 마련하고, 우수 리뷰어에게 혜택을 제공하여 긍정적인 구전 효과를 창출합니다. 물류와 서비스의 유기적인 결합을 통해 고객 경험의 전 과정을 혁신하고, 이를 통해 경쟁사가 따라올 수 없는 압도적인 서비스 경쟁력을 확보할 것입니다."
              }
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 Insight Analysis Dashboard. All rights reserved.</p>
          <p className="mt-2">Data based on LDA & NMF Topic Modeling Analysis.</p>
        </div>
      </footer>
    </div>
  );
}
