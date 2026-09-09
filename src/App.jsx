import { useMemo, useState } from 'react'
// eslint-disable-next-line import/no-unresolved
const architectures = [
  {
    id: 'soap',
    name: 'SOAP',
    year: 'W3C 2000 / 2003',
    tag: 'RPC doanh nghiệp',
    color: 'from-sky-600 to-cyan-500',
    accent: 'border-sky-200 bg-sky-50 text-sky-950',
    oneLine:
      'Gói lời gọi trong XML Envelope, hợp đồng WSDL chặt, mạnh khi cần bảo mật ở tầng thông điệp.',
    bestFor: 'Ngân hàng, bảo hiểm, ERP, cổng chính phủ, đối tác bắt buộc SOAP.',
    tradeoff:
      'XML nặng, WSDL cứng, độ phức tạp WS-* cao và không thân thiện với frontend hiện đại.',
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
    bullets: ['XML Envelope: Header + Body', 'WSDL bắt buộc và có thể sinh code', 'Lỗi trả về bằng soap:Fault'],
  },
  {
    id: 'rest',
    name: 'REST',
    year: 'Fielding 2000',
    tag: 'Tài nguyên + HTTP',
    color: 'from-emerald-600 to-teal-500',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    oneLine:
      'Mọi thứ là tài nguyên có URI; client dùng GET, POST, PUT, PATCH, DELETE và tận dụng cache HTTP.',
    bestFor: 'API công khai, web app, CRUD rõ ràng, đội mỏng cần dễ bàn giao.',
    tradeoff:
      'Có thể over-fetch, under-fetch và không có streaming sẵn; OpenAPI chỉ hữu ích nếu được giữ đồng bộ.',
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
    bullets: ['GET an toàn và cache được', 'ETag giúp trả 304 khi dữ liệu chưa đổi', 'OpenAPI mô tả hợp đồng API'],
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    year: 'Facebook 2015',
    tag: 'Client tự chọn dữ liệu',
    color: 'from-fuchsia-600 to-rose-500',
    accent: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950',
    oneLine:
      'Một endpoint, client gửi query mô tả đúng cây dữ liệu cần nhận, server trả về đúng hình dạng đó.',
    bestFor: 'Mobile app, nhiều loại client, BFF hoặc lớp gom dữ liệu.',
    tradeoff:
      'Cache HTTP kém, lỗi thường nằm trong body, server phải chống query quá sâu và vấn đề N+1.',
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
    bullets: ['Schema SDL kiểm kiểu mạnh', 'Query/mutation/subscription', 'DataLoader giúp giảm N+1'],
  },
  {
    id: 'grpc',
    name: 'gRPC',
    year: 'Google 2016',
    tag: 'RPC nhanh nội bộ',
    color: 'from-indigo-600 to-violet-500',
    accent: 'border-indigo-200 bg-indigo-50 text-indigo-950',
    oneLine:
      'Định nghĩa service bằng .proto, sinh client/server nhiều ngôn ngữ, truyền Protocol Buffers qua HTTP/2.',
    bestFor: 'Microservices nội bộ, IoT, realtime, streaming hai chiều, thông lượng cao.',
    tradeoff:
      'Trình duyệt không gọi trực tiếp; cần gRPC-Web + proxy, ít lợi thế cache HTTP và khó đọc bằng mắt.',
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
    responseTitle: 'Message sau khi deserialize',
    response: `Student {
  student_code: "SE181234"
  full_name: "Nguyen Van An"
  gpa: 3.42
}

// Trên wire là binary Protocol Buffers,
// nhỏ hơn JSON và phù hợp gọi nội bộ tốc độ cao.`,
    bullets: ['HTTP/2 multiplexing và streaming', '.proto bắt buộc, sinh code', 'Tốt cho backend-to-backend'],
  },
]

const comparisonRows = [
  ['Giao thức', 'HTTP/SMTP/TCP/JMS', 'HTTP/1.1, HTTP/2, HTTP/3', 'HTTP, thường POST /graphql', 'HTTP/2'],
  ['Định dạng', 'XML Envelope', 'JSON phổ biến', 'JSON', 'Protocol Buffers binary'],
  ['Giao diện', 'RPC theo thao tác', 'Tài nguyên + verb HTTP', 'Query theo schema', 'RPC theo method'],
  ['Hợp đồng', 'WSDL bắt buộc', 'OpenAPI tùy chọn', 'SDL bắt buộc', '.proto bắt buộc'],
  ['Cache', 'Kém, thường POST', 'Rất tốt: ETag, CDN', 'Kém ở tầng HTTP', 'Tự làm ở app layer'],
  ['Trình duyệt', 'Gọi được nhưng nặng', 'fetch() là đủ', 'Gọi tự nhiên bằng POST', 'Cần gRPC-Web + proxy'],
]

const constraints = [
  {
    id: 'client',
    label: 'Client chính',
    options: [
      { label: 'Web/public API', value: 'rest' },
      { label: 'Nhiều app cần data khác nhau', value: 'graphql' },
      { label: 'Service nội bộ', value: 'grpc' },
      { label: 'Đối tác legacy', value: 'soap' },
    ],
  },
  {
    id: 'network',
    label: 'Mạng chạy API',
    options: [
      { label: 'Internet công cộng', value: 'rest' },
      { label: 'Mobile yếu, ít round-trip', value: 'graphql' },
      { label: 'Nội bộ latency thấp', value: 'grpc' },
      { label: 'Nhiều chặng trung gian', value: 'soap' },
    ],
  },
  {
    id: 'contract',
    label: 'Kiểu hợp đồng',
    options: [
      { label: 'Dễ đọc, dễ bàn giao', value: 'rest' },
      { label: 'Schema query linh hoạt', value: 'graphql' },
      { label: 'Codegen bắt buộc', value: 'grpc' },
      { label: 'Ký số từng thông điệp', value: 'soap' },
    ],
  },
]

const myths = [
  ['gRPC nhanh nhất nên luôn tốt nhất', 'Nhanh trong mạng nội bộ. Ra Internet công cộng, proxy, cache và CDN có thể quan trọng hơn vài chục mili-giây.'],
  ['REST nghĩa là JSON qua HTTP', 'REST là tập ràng buộc: stateless, cacheable, uniform interface, layered system. JSON chỉ là một định dạng thường dùng.'],
  ['GraphQL thay thế REST', 'GraphQL là ngôn ngữ truy vấn, REST là phong cách kiến trúc. Nhiều hệ thống chạy cả hai.'],
  ['SOAP đã chết', 'SOAP vẫn sống trong ngân hàng, bảo hiểm, ERP và nơi cần WS-Security hoặc hợp đồng liên tổ chức.'],
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
              Học nhanh SOAP, REST, GraphQL và gRPC qua ví dụ Student Management
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Không có kiến trúc API tốt nhất cho mọi trường hợp. Hãy nhìn vào client, mạng, hợp đồng và kỹ năng đội ngũ để chọn phương án phù hợp.
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
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Nên dùng khi</h3>
                <p className="mt-2 text-base leading-7 text-slate-800">{active.bestFor}</p>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Đánh đổi</h3>
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
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">So sánh nhanh</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Cùng một tiêu chí, bốn cách giải</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Dùng bảng này để nhớ sự khác biệt cốt lõi trước khi đi vào lập luận chọn kiến trúc.
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
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Decision demo</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Chọn kiến trúc theo ràng buộc</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Bốn câu hỏi hay quyết định kiến trúc: ai là client, API chạy trên mạng nào, ai giữ hợp đồng, và đội có vận hành nổi không.
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
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Gợi ý hiện tại</p>
          <h2 className="mt-2 text-4xl font-black text-slate-950">{recommendation.name}</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">{recommendation.bestFor}</p>
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Nhớ câu này</h3>
            <p className="mt-2 text-lg font-bold leading-7 text-slate-950">
              Chọn kiến trúc API là chọn ràng buộc, không phải chọn công nghệ cho mới.
            </p>
          </div>
        </article>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Case study</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Student Management System: REST ra ngoài, gRPC vào trong</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {[
              ['Web / Mobile', 'Sinh viên, giảng viên, phòng đào tạo'],
              ['API Gateway', 'HTTPS, REST/JSON, JWT, rate limit, ETag'],
              ['Services nội bộ', 'Student, Enrollment, Grading'],
              ['gRPC HTTP/2', 'Trao đổi nhanh trong mạng tin cậy'],
              ['Database / Adapter', 'PostgreSQL, Redis, SOAP adapter cho ngân hàng'],
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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Lỗi lập luận</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Những câu dễ nói sai khi so sánh API</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Khi bảo vệ lựa chọn, phần quan trọng nhất là nói rõ mình được gì, mất gì, và sẽ giảm rủi ro bằng cách nào.
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
