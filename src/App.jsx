import { useMemo, useState } from 'react'

const architectures = [
  {
    id: 'soap',
    name: 'SOAP',
    year: 'W3C 2000 / 2003',
    tag: 'Doanh nghiệp / WS-Security',
    color: 'from-sky-600 to-cyan-500',
    accent: 'border-sky-200 bg-sky-50 text-sky-950',
    oneLine:
      'Đóng gói request trong XML Envelope, định nghĩa WSDL chặt chẽ, tối ưu cho bảo mật tầng thông điệp (WS-Security).',
    bestFor: 'Tích hợp hệ thống ngân hàng, bảo hiểm, ERP, dịch vụ công hoặc kết nối đối tác quy định chuẩn SOAP.',
    tradeoff:
      'Payload XML cồng kềnh, cấu hình WS-* phức tạp, WSDL thiếu linh hoạt và không tối ưu cho Web/Mobile frontend.',
    requestTitle: 'SOAP request',
    request: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
  xmlns:sms="http://sms.university.edu.vn/">
  <soap:Header>
    <wsse:Security>signature, timestamp</wsse:Security>
  </soap:Header>
  <soap:Body>
    <sms:GetStudentRequest>
      <sms:studentCode>SE181234</sms:studentCode>
    </sms:GetStudentRequest>
  </soap:Body>
</soap:Envelope>`,
    responseTitle: 'SOAP response',
    response: `<soap:Envelope>
  <soap:Body>
    <sms:GetStudentResponse>
      <studentCode>SE181234</studentCode>
      <fullName>Nguyen Van An</fullName>
      <gpa>3.42</gpa>
    </sms:GetStudentResponse>
  </soap:Body>
</soap:Envelope>`,
    bullets: [
      'Cấu trúc XML Envelope chuẩn (Header + Body)',
      'Bắt buộc dùng WSDL để sinh code & kiểm tra dữ liệu',
      'Phản hồi lỗi chuẩn qua thẻ <soap:Fault>',
    ],
  },
  {
    id: 'rest',
    name: 'REST',
    year: 'Fielding 2000',
    tag: 'Resource-Based (HTTP)',
    color: 'from-emerald-600 to-teal-500',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    oneLine:
      'Quản lý tài nguyên qua URI, sử dụng chuẩn phương thức HTTP (GET, POST, PUT, DELETE) và tận dụng HTTP caching.',
    bestFor: 'Public API, web/mobile app tiêu chuẩn, dịch vụ CRUD và dự án cần tích hợp nhanh chóng, dễ bảo trì.',
    tradeoff:
      'Dễ gặp sự cố over-fetching hoặc under-fetching; cần chủ động bảo trì tài liệu hợp đồng OpenAPI.',
    requestTitle: 'REST request',
    request: `GET /api/v1/students/SE181234/enrollments?term=FA26 HTTP/1.1
Host: sms.university.edu.vn
Authorization: Bearer eyJhbGciOi...
Accept: application/json
If-None-Match: "v7-9f2a"`,
    responseTitle: 'REST response',
    response: `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
ETag: "v8-1c4d"
Cache-Control: private, max-age=60

{
  "studentCode": "SE181234",
  "fullName": "Nguyen Van An",
  "term": "FA26",
  "gpa": 3.42,
  "enrollments": [
    { "subjectCode": "PRN231", "grade": 8.1, "status": "PASSED" },
    { "subjectCode": "SWD392", "grade": 7.5, "status": "PASSED" },
    { "subjectCode": "EXE101", "grade": null, "status": "IN_PROGRESS" }
  ]
}`,
    bullets: [
      'Phương thức GET an toàn và hỗ trợ caching tốt',
      'Sử dụng ETag (304 Not Modified) để tiết kiệm băng thông',
      'Chuẩn hóa tài liệu hợp đồng bằng OpenAPI / Swagger',
    ],
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    year: 'Facebook 2015',
    tag: 'Client-Driven Queries',
    color: 'from-fuchsia-600 to-rose-500',
    accent: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950',
    oneLine:
      'Chỉ dùng một endpoint duy nhất, client tự truy vấn chính xác các trường dữ liệu cần thiết và nhận kết quả tương ứng.',
    bestFor: 'Ứng dụng mobile, hệ thống đa nền tảng (multi-client), mô hình BFF (Backend-for-Frontend) hoặc tích hợp tổng hợp dữ liệu.',
    tradeoff:
      'Khó tận dụng HTTP cache, lỗi thường nằm trong response body (HTTP 200), cần giải quyết bài toán N+1 query.',
    requestTitle: 'GraphQL query',
    request: `POST /graphql

query GetStudentResult {
  student(code: "SE181234") {
    fullName
    gpa
    enrollments(term: "FA26") {
      subject { code name }
      grade
    }
  }
}`,
    responseTitle: 'GraphQL response',
    response: `HTTP/1.1 200 OK

{
  "data": {
    "student": {
      "fullName": "Nguyen Van An",
      "gpa": 3.42,
      "enrollments": [
        { "subject": { "code": "PRN231", "name": "API Design" }, "grade": 8.1 },
        { "subject": { "code": "SWD392", "name": "Architecture" }, "grade": 7.5 }
      ]
    }
  }
}`,
    bullets: [
      'Định nghĩa Schema SDL chặt chẽ với strong-typing',
      'Hỗ trợ Query (đọc), Mutation (ghi) và Subscription (realtime)',
      'Tối ưu hiệu năng N+1 bằng cơ chế DataLoader',
    ],
  },
  {
    id: 'grpc',
    name: 'gRPC',
    year: 'Google 2016',
    tag: 'High-Performance RPC',
    color: 'from-indigo-600 to-violet-500',
    accent: 'border-indigo-200 bg-indigo-50 text-indigo-950',
    oneLine:
      'Định nghĩa service qua file .proto, tự sinh code client/server đa ngôn ngữ, truyền tải dữ liệu nhị phân Protocol Buffers qua HTTP/2.',
    bestFor: 'Giao tiếp nội bộ giữa các microservices, ứng dụng realtime, IoT, streaming 2 chiều và đòi hỏi hiệu năng cao.',
    tradeoff:
      'Trình duyệt không hỗ trợ trực tiếp (cần gRPC-Web & proxy), payload nhị phân khó đọc debug thủ công.',
    requestTitle: 'gRPC proto',
    request: `syntax = "proto3";
package sms.v1;

service StudentService {
  rpc GetStudent (GetStudentRequest) returns (Student);
  rpc StreamGrades (GradeFilter) returns (stream Grade);
}

message GetStudentRequest {
  string student_code = 1;
}`,
    responseTitle: 'Phản hồi sau khi Deserialize',
    response: `Student {
  student_code: "SE181234"
  full_name: "Nguyen Van An"
  gpa: 3.42
}

// Dữ liệu truyền trên mạng (wire format) là nhị phân Protocol Buffers,
// kích thước nhỏ hơn nhiều so với JSON và tối ưu cho giao tiếp nội bộ.`,
    bullets: [
      'Tận dụng tối đa HTTP/2 Multiplexing & Streaming',
      'Khai báo bằng .proto để tự động sinh SDK client/server',
      'Tối ưu xuất sắc cho kết nối Backend-to-Backend',
    ],
  },
]

const comparisonRows = [
  ['Giao thức', 'HTTP / SMTP / TCP / JMS', 'HTTP/1.1, HTTP/2, HTTP/3', 'HTTP (thường dùng POST)', 'HTTP/2'],
  ['Định dạng dữ liệu', 'XML Envelope', 'JSON (phổ biến) / XML', 'JSON', 'Protocol Buffers (Binary)'],
  ['Mô hình giao tiếp', 'RPC theo thao tác (Action-based)', 'Tài nguyên + HTTP Verbs (Resource-based)', 'Truy vấn theo Schema (Query-based)', 'RPC theo phương thức (Method-based)'],
  ['Định nghĩa hợp đồng (Contract)', 'WSDL (Bắt buộc)', 'OpenAPI / Swagger (Tùy chọn)', 'GraphQL Schema / SDL (Bắt buộc)', '.proto File (Bắt buộc)'],
  ['Cơ chế Caching', 'Hạn chế (thường dùng POST)', 'Rất tốt (ETag, HTTP Cache Headers, CDN)', 'Hạn chế ở tầng HTTP', 'Tự xử lý ở tầng Application'],
  ['Hỗ trợ Browser', 'Phức tạp, payload nặng', 'Hỗ trợ trực tiếp (fetch / axios)', 'Hỗ trợ trực tiếp qua HTTP POST', 'Cần gRPC-Web và Proxy (Envoy)'],
]

const constraints = [
  {
    id: 'client',
    label: 'Đối tượng Client chính',
    options: [
      { label: 'Ứng dụng Web / Public API', value: 'rest' },
      { label: 'Đa nền tảng, nhu cầu dữ liệu linh hoạt', value: 'graphql' },
      { label: 'Giao tiếp giữa các Service nội bộ', value: 'grpc' },
      { label: 'Hệ thống đối tác cũ (Legacy)', value: 'soap' },
    ],
  },
  {
    id: 'network',
    label: 'Môi trường mạng',
    options: [
      { label: 'Internet công cộng (Public Internet)', value: 'rest' },
      { label: 'Mạng di động / Cần tối ưu số lần round-trip', value: 'graphql' },
      { label: 'Mạng nội bộ (Intranet) độ trễ thấp', value: 'grpc' },
      { label: 'Giao dịch qua nhiều chặng trung gian', value: 'soap' },
    ],
  },
  {
    id: 'contract',
    label: 'Yêu cầu Hợp đồng (Contract)',
    options: [
      { label: 'Đơn giản, dễ đọc, dễ tích hợp', value: 'rest' },
      { label: 'Schema linh hoạt, client tự chọn field', value: 'graphql' },
      { label: 'Bắt buộc tự động sinh code (Codegen)', value: 'grpc' },
      { label: 'Bảo mật nghiêm ngặt, ký số thông điệp', value: 'soap' },
    ],
  },
]

const myths = [
  ['gRPC nhanh nhất nên luôn là lựa chọn hàng đầu', 'gRPC tối ưu trong mạng nội bộ. Khi ra Internet công cộng, khả năng caching ở CDN, Proxy và tính đơn giản của HTTP REST mới là yếu tố quyết định.'],
  ['REST đơn thuần chỉ là JSON truyền qua HTTP', 'REST là một phong cách kiến trúc với các ràng buộc khắt khe: Stateless, Cacheable, Uniform Interface, Layered System. JSON chỉ là định dạng truyền dữ liệu phổ biến.'],
  ['GraphQL ra đời để thay thế hoàn toàn REST', 'GraphQL là ngôn ngữ truy vấn dữ liệu, còn REST là phong cách kiến trúc API. Trong nhiều hệ thống thực tế, cả hai được phối hợp sử dụng hiệu quả.'],
  ['SOAP là công nghệ đã lạc hậu và không còn dùng', 'SOAP vẫn đóng vai trò trụ cột trong ngành Ngân hàng, Tài chính, Bảo hiểm và ERP – những nơi đặt tiêu chí bảo mật WS-Security và hợp đồng WSDL lên hàng đầu.'],
]

function getRecommendation(selections) {
  const scores = architectures.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})

  Object.values(selections).forEach((value) => {
    scores[value] += 1
  })

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  return architectures.find((item) => item.id === winner)
}

function CodeBlock({ title, children }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-sm font-semibold text-slate-200">{title}</span>
        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">demo</span>
      </div>
      <pre className="max-h-[430px] overflow-auto p-4 text-left text-[13px] leading-relaxed text-slate-100">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function App() {
  const [activeId, setActiveId] = useState('rest')
  const [selections, setSelections] = useState({
    client: 'rest',
    network: 'rest',
    contract: 'rest',
  })

  const active = architectures.find((item) => item.id === activeId)
  const recommendation = useMemo(() => getRecommendation(selections), [selections])

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              API Architecture Lab
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Phân tích & So sánh SOAP, REST, GraphQL và gRPC qua bài toán Quản lý Sinh viên
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Không có kiến trúc API duy nhất tối ưu cho mọi ứng dụng. Quyết định phù hợp dựa trên đối tượng Client, hạ tầng mạng, quy chuẩn Contract và năng lực đội ngũ.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {architectures.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`rounded-md border px-4 py-2 text-sm font-bold transition ${
                    activeId === item.id
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-950'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {architectures.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`group grid grid-cols-[auto_1fr] gap-4 rounded-lg border p-4 text-left transition ${
                  activeId === item.id
                    ? 'border-slate-950 bg-white shadow-sm'
                    : 'border-slate-200 bg-white/70 hover:border-slate-400'
                }`}
              >
                <span className={`h-12 w-12 rounded-lg bg-gradient-to-br ${item.color} text-center text-lg font-black leading-[3rem] text-white`}>
                  {item.name.slice(0, 1)}
                </span>
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-black text-slate-950">{item.name}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{item.year}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">{item.oneLine}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${active.accent}`}>
              {active.tag}
            </div>
            <h2 className="mt-4 text-3xl font-black text-slate-950">{active.name}</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{active.oneLine}</p>

            <div className="mt-6 grid gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Trường hợp sử dụng (Best For)</h3>
                <p className="mt-2 text-base leading-7 text-slate-800">{active.bestFor}</p>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Nhược điểm & Đánh đổi (Trade-offs)</h3>
                <p className="mt-2 text-base leading-7 text-slate-800">{active.tradeoff}</p>
              </div>
            </div>

            <ul className="mt-6 grid gap-2">
              {active.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className="grid gap-4">
            <CodeBlock title={active.requestTitle}>{active.request}</CodeBlock>
            <CodeBlock title={active.responseTitle}>{active.response}</CodeBlock>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Bảng So sánh Tổng quan</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">So sánh chi tiết theo các tiêu chí kỹ thuật</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Tổng hợp những điểm khác biệt cốt lõi giữa 4 kiến trúc API phổ biến nhất hiện nay.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold">Tiêu chí</th>
                    {architectures.map((item) => (
                      <th key={item.id} className="px-4 py-3 font-bold">{item.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="border-t border-slate-200 odd:bg-white even:bg-slate-50">
                      {row.map((cell, index) => (
                        <td key={`${row[0]}-${cell}`} className={`px-4 py-3 align-top ${index === 0 ? 'font-black text-slate-950' : 'text-slate-700'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Tư vấn Kiến trúc</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Lựa chọn kiến trúc phù hợp với nhu cầu</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            4 yếu tố quyết định: Đối tượng client, môi trường mạng truyền tải, cơ chế hợp đồng dữ liệu và năng lực vận hành.
          </p>

          <div className="mt-6 grid gap-5">
            {constraints.map((group) => (
              <div key={group.id}>
                <h3 className="text-sm font-black text-slate-800">{group.label}</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {group.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setSelections((current) => ({ ...current, [group.id]: option.value }))}
                      className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                        selections[group.id] === option.value
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className={`h-2 rounded-full bg-gradient-to-r ${recommendation.color}`} />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Kiến trúc đề xuất</p>
          <h2 className="mt-2 text-4xl font-black text-slate-950">{recommendation.name}</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">{recommendation.bestFor}</p>
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Thông điệp cốt lõi</h3>
            <p className="mt-2 text-lg font-bold leading-7 text-slate-950">
              Lựa chọn kiến trúc API là chấp nhận các ràng buộc kỹ thuật phù hợp, không phải chạy theo xu hướng công nghệ.
            </p>
          </div>
        </article>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Thực tế Triển khai (Case Study)</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Hệ thống Quản lý Sinh viên: REST cho Bên ngoài (Client), gRPC cho Nội bộ (Microservices)</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {[
              ['Web / Mobile Client', 'Giao diện Sinh viên, Giảng viên & Quản trị viên'],
              ['API Gateway', 'Xử lý HTTPS, REST/JSON, JWT Auth, Rate Limiting & ETag'],
              ['Internal Services', 'Các dịch vụ nội bộ: Student, Enrollment, Grading'],
              ['gRPC (HTTP/2)', 'Giao tiếp tốc độ cao giữa các Microservices trong mạng nội bộ'],
              ['Database & Adapter', 'Lưu trữ PostgreSQL, Redis và SOAP Adapter kết nối ngân hàng'],
            ].map((step, index) => (
              <div key={step[0]} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-950">{step[0]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <article>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Góc nhìn & Hiểu lầm</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Giải mã các quan niệm chưa chính xác về API</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Khi đề xuất kiến trúc, yếu tố quan trọng là phân tích rõ ưu điểm, nhược điểm và phương án tối ưu rủi ro vận hành.
            </p>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {myths.map(([myth, answer]) => (
              <article key={myth} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-base font-black text-slate-950">"{myth}"</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
