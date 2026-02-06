import { useState, type ReactNode } from 'react';
import DemoStep from './DemoStep';

interface Step {
  title: string;
  description: ReactNode;
  codeTitle: string;
  code: string;
}

const steps: Step[] = [
  {
    title: 'Local Development',
    description: (
      <>
        Start OpenData Log locally with a single command. Data is stored on local disk.
        No dependencies, no setup. Write a message and read it back.
      </>
    ),
    codeTitle: 'terminal',
    code: `# Start OpenData Log locally
$ docker run -p 8080:8080 opendata/log:latest

# Write a message
$ curl -X POST http://localhost:8080/v1/topics/events/messages \\
    -H "Content-Type: application/json" \\
    -d '{"value": "hello, opendata"}'

{"offset": 0, "topic": "events"}

# Read it back
$ curl http://localhost:8080/v1/topics/events/messages?offset=0

{"messages": [{"offset": 0, "value": "hello, opendata"}]}`,
  },
  {
    title: 'Move to Cloud Storage',
    description: (
      <>
        Change one config value. You now have 11 nines of durability with replicated
        object storage. No MinIO, no local S3 emulation &mdash; SlateDB makes local disk
        and object storage interchangeable.
      </>
    ),
    codeTitle: 'opendata.toml',
    code: `# Before: local disk
[storage]
backend = "local"
path = "/data/opendata-log"

# After: cloud object storage
[storage]
backend = "s3"
bucket = "my-opendata-bucket"
region = "us-east-1"

# Everything else stays the same.
# Same container. Same API. Same data format.`,
  },
  {
    title: 'Deploy to Production',
    description: (
      <>
        Same container image, same metrics, same operational model as your laptop.
        Add a Prometheus scrape config and you have full observability.
      </>
    ),
    codeTitle: 'docker-compose.yml',
    code: `services:
  opendata-log:
    image: opendata/log:latest
    ports:
      - "8080:8080"
      - "9090:9090"  # metrics
    environment:
      OPENDATA_STORAGE_BACKEND: s3
      OPENDATA_STORAGE_BUCKET: my-opendata-bucket
      OPENDATA_STORAGE_REGION: us-east-1
    # TODO: Add resource limits, health checks

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    # Scrape opendata-log:9090/metrics`,
  },
  {
    title: 'Scale',
    description: (
      <>
        Add read replicas with a single command. Readers and writers are stateless and
        decoupled &mdash; no rebalancing, no leader election, no data migration. The CLI
        is shared across all OpenData databases.
      </>
    ),
    codeTitle: 'terminal',
    code: `# Scale up read replicas
$ opendata scale log --readers 3

Scaling opendata-log readers: 1 → 3
  ✓ Reader replica 2 started
  ✓ Reader replica 3 started
  ✓ Load balancer updated

# Check cluster status
$ opendata status log

opendata-log
  Writers:  1 (active)
  Readers:  3 (healthy)
  Storage:  s3://my-opendata-bucket
  Lag:      < 100ms`,
  },
  {
    title: 'Add Another Database',
    description: (
      <>
        Deploy OpenData Timeseries with the exact same pattern. Same <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-xs text-[#4f46e5]">docker run</code>,
        same storage config, same CLI, same Prometheus metrics.
        You already know how to operate this.
      </>
    ),
    codeTitle: 'terminal',
    code: `# Same pattern, different database
$ docker run -p 8081:8080 \\
    -e OPENDATA_STORAGE_BACKEND=s3 \\
    -e OPENDATA_STORAGE_BUCKET=my-opendata-bucket \\
    opendata/timeseries:latest

# Write Prometheus metrics
$ curl -X POST http://localhost:8081/api/v1/write \\
    --data-binary @metrics.prom

# Query with PromQL — it's Prometheus-compatible
$ curl http://localhost:8081/api/v1/query \\
    -d 'query=rate(http_requests_total[5m])'

# Same CLI, same scaling model
$ opendata scale timeseries --readers 2`,
  },
];

export default function Demo() {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = steps[activeStep];

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
      {/* Step list */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <DemoStep
            key={i}
            stepNumber={i + 1}
            title={step.title}
            description={step.description}
            code={step.code}
            codeTitle={step.codeTitle}
            isActive={i === activeStep}
            onClick={() => setActiveStep(i)}
          />
        ))}
      </div>

      {/* Code panel */}
      <div className="sticky top-24 rounded-xl overflow-hidden shadow-xl bg-[#1e1e2e] border border-[#313244]">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#181825] border-b border-[#313244]">
          <span className="w-3 h-3 rounded-full bg-[#f38ba8]" />
          <span className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
          <span className="w-3 h-3 rounded-full bg-[#f9e2af]" />
          <span className="ml-2 text-xs text-[#a6adc8] font-mono">
            {currentStep.codeTitle}
          </span>
        </div>
        <div className="p-5 overflow-x-auto">
          <pre className="text-sm leading-relaxed font-mono">
            <code className="text-[#cdd6f4]">
              {currentStep.code.split('\n').map((line, i) => (
                <div key={`${activeStep}-${i}`} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  {formatLine(line)}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function formatLine(line: string): React.ReactNode {
  // Comments
  if (line.trimStart().startsWith('#')) {
    return <span className="text-[#6c7086]">{line}</span>;
  }
  // Shell prompt
  if (line.startsWith('$')) {
    return (
      <>
        <span className="text-[#a6e3a1]">$</span>
        <span className="text-[#cdd6f4]">{line.slice(1)}</span>
      </>
    );
  }
  // YAML/TOML keys
  if (line.match(/^\s*\w[\w.-]*\s*[:=]/)) {
    const match = line.match(/^(\s*)([\w.[\]-]+)(\s*[:=]\s*)(.*)/);
    if (match) {
      return (
        <>
          {match[1]}
          <span className="text-[#89b4fa]">{match[2]}</span>
          <span className="text-[#6c7086]">{match[3]}</span>
          <span className="text-[#a6e3a1]">{match[4]}</span>
        </>
      );
    }
  }
  // Success markers
  if (line.includes('✓')) {
    return <span className="text-[#a6e3a1]">{line}</span>;
  }
  // JSON-like output
  if (line.trimStart().startsWith('{') || line.trimStart().startsWith('[')) {
    return <span className="text-[#f9e2af]">{line}</span>;
  }
  // Status lines
  if (line.match(/^\s*(Writers|Readers|Storage|Lag|Scaling):/)) {
    const match = line.match(/^(\s*\w+:)(.*)/);
    if (match) {
      return (
        <>
          <span className="text-[#89b4fa]">{match[1]}</span>
          <span className="text-[#cdd6f4]">{match[2]}</span>
        </>
      );
    }
  }
  // Section headers like [storage]
  if (line.match(/^\s*\[[\w.-]+\]/)) {
    return <span className="text-[#cba6f7]">{line}</span>;
  }
  return line;
}
