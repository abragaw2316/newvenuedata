export interface SdkSnippetTab {
  label: string
  language: string
  code: string
}

export interface SdkSnippet {
  id: string
  title: string
  tabs: SdkSnippetTab[]
}

/**
 * Real, idiomatic SDK snippets for the key New Venue Data API operations.
 *
 * Base URL:   https://api.newvenuedata.com/v1
 * Auth:       Authorization: Bearer ls_live_...
 *
 * Endpoints these snippets target:
 *   GET  /v1/licenses?county=&license_type=&event_type=&status=&q=&limit=&cursor=
 *        -> { data: License[], pagination: { cursor, hasMore, total, limit } }
 *   GET  /v1/licenses/:id
 *        -> { data: License }  (404 -> { error: { type, message } })
 *   GET  /v1/licenses/search?q=&county=&limit=
 *        -> { data: License[], query, count }
 *   Webhooks are signed with HMAC-SHA256 over the raw request body, hex-encoded,
 *   delivered in the `New Venue Data-Signature` header.
 */
export const SDK_SNIPPETS: SdkSnippet[] = [
  {
    id: 'list-licenses',
    title: 'List licenses',
    tabs: [
      {
        label: 'cURL',
        language: 'bash',
        code: `curl -G "https://api.newvenuedata.com/v1/licenses" \\
  -H "Authorization: Bearer ls_live_xxxxxxxxxxxxxxxx" \\
  --data-urlencode "county=Miami-Dade" \\
  --data-urlencode "license_type=SRX" \\
  --data-urlencode "event_type=new_filing" \\
  --data-urlencode "limit=25"`,
      },
      {
        label: 'Node.js',
        language: 'javascript',
        code: `const params = new URLSearchParams({
  county: "Miami-Dade",
  license_type: "SRX",
  event_type: "new_filing",
  limit: "25",
});

const res = await fetch(
  \`https://api.newvenuedata.com/v1/licenses?\${params}\`,
  {
    headers: {
      Authorization: \`Bearer \${process.env.LICENSESIGNAL_API_KEY}\`,
    },
  }
);

if (!res.ok) {
  throw new Error(\`New Venue Data API error: \${res.status}\`);
}

const { data, pagination } = await res.json();
console.log(\`\${data.length} of \${pagination.total} records\`);

// Paginate with the opaque cursor until it is null.
let cursor = pagination.cursor;
while (cursor) {
  const next = await fetch(
    \`https://api.newvenuedata.com/v1/licenses?\${new URLSearchParams({
      county: "Miami-Dade",
      cursor,
    })}\`,
    { headers: { Authorization: \`Bearer \${process.env.LICENSESIGNAL_API_KEY}\` } }
  ).then((r) => r.json());
  cursor = next.pagination.cursor;
}`,
      },
      {
        label: 'Python',
        language: 'python',
        code: `import os
import requests

API_KEY = os.environ["LICENSESIGNAL_API_KEY"]
BASE_URL = "https://api.newvenuedata.com/v1"

headers = {"Authorization": f"Bearer {API_KEY}"}
params = {
    "county": "Miami-Dade",
    "license_type": "SRX",
    "event_type": "new_filing",
    "limit": 25,
}

resp = requests.get(f"{BASE_URL}/licenses", headers=headers, params=params)
resp.raise_for_status()
body = resp.json()

print(f"{len(body['data'])} of {body['pagination']['total']} records")

# Paginate with the opaque cursor until it is None.
cursor = body["pagination"]["cursor"]
while cursor:
    page = requests.get(
        f"{BASE_URL}/licenses",
        headers=headers,
        params={"county": "Miami-Dade", "cursor": cursor},
    ).json()
    cursor = page["pagination"]["cursor"]`,
      },
      {
        label: 'Go',
        language: 'go',
        code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

type License struct {
	ID            string \`json:"id"\`
	LicenseNumber string \`json:"licenseNumber"\`
	BusinessName  string \`json:"businessName"\`
	LicenseType   string \`json:"licenseType"\`
	Status        string \`json:"status"\`
}

type ListResponse struct {
	Data       []License \`json:"data"\`
	Pagination struct {
		Cursor  *string \`json:"cursor"\`
		HasMore bool    \`json:"hasMore"\`
		Total   int     \`json:"total"\`
		Limit   int     \`json:"limit"\`
	} \`json:"pagination"\`
}

func main() {
	q := url.Values{}
	q.Set("county", "Miami-Dade")
	q.Set("license_type", "SRX")
	q.Set("event_type", "new_filing")
	q.Set("limit", "25")

	endpoint := "https://api.newvenuedata.com/v1/licenses?" + q.Encode()
	req, _ := http.NewRequest(http.MethodGet, endpoint, nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("LICENSESIGNAL_API_KEY"))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var out ListResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		panic(err)
	}

	fmt.Printf("%d of %d records\\n", len(out.Data), out.Pagination.Total)
}`,
      },
      {
        label: 'PHP',
        language: 'php',
        code: `<?php

$apiKey = getenv('LICENSESIGNAL_API_KEY');

$query = http_build_query([
    'county' => 'Miami-Dade',
    'license_type' => 'SRX',
    'event_type' => 'new_filing',
    'limit' => 25,
]);

$ch = curl_init("https://api.newvenuedata.com/v1/licenses?$query");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $apiKey",
    ],
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status !== 200) {
    throw new RuntimeException("New Venue Data API error: $status");
}

$body = json_decode($response, true);
printf("%d of %d records\\n", count($body['data']), $body['pagination']['total']);`,
      },
    ],
  },
  {
    id: 'get-license',
    title: 'Get a license',
    tabs: [
      {
        label: 'cURL',
        language: 'bash',
        code: `curl "https://api.newvenuedata.com/v1/licenses/lic_8f3a1c2e" \\
  -H "Authorization: Bearer ls_live_xxxxxxxxxxxxxxxx"`,
      },
      {
        label: 'Node.js',
        language: 'javascript',
        code: `const id = "lic_8f3a1c2e"; // accepts an id or a license number

const res = await fetch(
  \`https://api.newvenuedata.com/v1/licenses/\${id}\`,
  {
    headers: {
      Authorization: \`Bearer \${process.env.LICENSESIGNAL_API_KEY}\`,
    },
  }
);

if (res.status === 404) {
  const { error } = await res.json();
  throw new Error(error.message);
}
if (!res.ok) {
  throw new Error(\`New Venue Data API error: \${res.status}\`);
}

const { data } = await res.json();
console.log(data.businessName, data.status);`,
      },
      {
        label: 'Python',
        language: 'python',
        code: `import os
import requests

API_KEY = os.environ["LICENSESIGNAL_API_KEY"]
license_id = "lic_8f3a1c2e"  # accepts an id or a license number

resp = requests.get(
    f"https://api.newvenuedata.com/v1/licenses/{license_id}",
    headers={"Authorization": f"Bearer {API_KEY}"},
)

if resp.status_code == 404:
    raise LookupError(resp.json()["error"]["message"])
resp.raise_for_status()

record = resp.json()["data"]
print(record["businessName"], record["status"])`,
      },
      {
        label: 'Go',
        language: 'go',
        code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	id := "lic_8f3a1c2e" // accepts an id or a license number
	url := "https://api.newvenuedata.com/v1/licenses/" + id

	req, _ := http.NewRequest(http.MethodGet, url, nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("LICENSESIGNAL_API_KEY"))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		panic("license not found")
	}

	var out struct {
		Data struct {
			BusinessName string \`json:"businessName"\`
			Status       string \`json:"status"\`
		} \`json:"data"\`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		panic(err)
	}

	fmt.Println(out.Data.BusinessName, out.Data.Status)
}`,
      },
      {
        label: 'PHP',
        language: 'php',
        code: `<?php

$apiKey = getenv('LICENSESIGNAL_API_KEY');
$id = 'lic_8f3a1c2e'; // accepts an id or a license number

$ch = curl_init("https://api.newvenuedata.com/v1/licenses/$id");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $apiKey"],
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status === 404) {
    $error = json_decode($response, true)['error'];
    throw new RuntimeException($error['message']);
}

$record = json_decode($response, true)['data'];
printf("%s — %s\\n", $record['businessName'], $record['status']);`,
      },
    ],
  },
  {
    id: 'search-licenses',
    title: 'Search licenses',
    tabs: [
      {
        label: 'cURL',
        language: 'bash',
        code: `curl -G "https://api.newvenuedata.com/v1/licenses/search" \\
  -H "Authorization: Bearer ls_live_xxxxxxxxxxxxxxxx" \\
  --data-urlencode "q=sunset grill" \\
  --data-urlencode "county=Broward" \\
  --data-urlencode "limit=10"`,
      },
      {
        label: 'Node.js',
        language: 'javascript',
        code: `const params = new URLSearchParams({
  q: "sunset grill",
  county: "Broward",
  limit: "10",
});

const res = await fetch(
  \`https://api.newvenuedata.com/v1/licenses/search?\${params}\`,
  {
    headers: {
      Authorization: \`Bearer \${process.env.LICENSESIGNAL_API_KEY}\`,
    },
  }
);

if (!res.ok) {
  throw new Error(\`New Venue Data API error: \${res.status}\`);
}

const { data, count } = await res.json();
console.log(\`\${count} matches\`);
for (const record of data) {
  console.log(record.licenseNumber, record.businessName);
}`,
      },
      {
        label: 'Python',
        language: 'python',
        code: `import os
import requests

API_KEY = os.environ["LICENSESIGNAL_API_KEY"]

resp = requests.get(
    "https://api.newvenuedata.com/v1/licenses/search",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={"q": "sunset grill", "county": "Broward", "limit": 10},
)
resp.raise_for_status()
body = resp.json()

print(f"{body['count']} matches")
for record in body["data"]:
    print(record["licenseNumber"], record["businessName"])`,
      },
      {
        label: 'Go',
        language: 'go',
        code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

func main() {
	q := url.Values{}
	q.Set("q", "sunset grill")
	q.Set("county", "Broward")
	q.Set("limit", "10")

	endpoint := "https://api.newvenuedata.com/v1/licenses/search?" + q.Encode()
	req, _ := http.NewRequest(http.MethodGet, endpoint, nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("LICENSESIGNAL_API_KEY"))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var out struct {
		Data []struct {
			LicenseNumber string \`json:"licenseNumber"\`
			BusinessName  string \`json:"businessName"\`
		} \`json:"data"\`
		Count int \`json:"count"\`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		panic(err)
	}

	fmt.Printf("%d matches\\n", out.Count)
	for _, r := range out.Data {
		fmt.Println(r.LicenseNumber, r.BusinessName)
	}
}`,
      },
      {
        label: 'PHP',
        language: 'php',
        code: `<?php

$apiKey = getenv('LICENSESIGNAL_API_KEY');

$query = http_build_query([
    'q' => 'sunset grill',
    'county' => 'Broward',
    'limit' => 10,
]);

$ch = curl_init("https://api.newvenuedata.com/v1/licenses/search?$query");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $apiKey"],
]);

$response = curl_exec($ch);
curl_close($ch);

$body = json_decode($response, true);
printf("%d matches\\n", $body['count']);
foreach ($body['data'] as $record) {
    printf("%s — %s\\n", $record['licenseNumber'], $record['businessName']);
}`,
      },
    ],
  },
  {
    id: 'verify-webhook',
    title: 'Verify a webhook signature',
    tabs: [
      {
        label: 'Node.js',
        language: 'javascript',
        code: `import crypto from "node:crypto";

// Each webhook delivery is signed with HMAC-SHA256 over the raw
// request body using your endpoint's signing secret (whsec_...).
// The hex digest arrives in the "New Venue Data-Signature" header.
function verifySignature(rawBody, signatureHeader, signingSecret) {
  const expected = crypto
    .createHmac("sha256", signingSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signatureHeader ?? "", "hex");

  // Constant-time comparison to avoid timing attacks.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Express handler. Mount with express.raw so req.body is the raw bytes.
export function handleWebhook(req, res) {
  const signature = req.header("New Venue Data-Signature");
  const valid = verifySignature(
    req.body, // Buffer / raw string, NOT parsed JSON
    signature,
    process.env.LICENSESIGNAL_WEBHOOK_SECRET
  );

  if (!valid) {
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(req.body.toString("utf8"));
  console.log("Received event:", event.type);
  res.status(200).send("ok");
}`,
      },
      {
        label: 'Python',
        language: 'python',
        code: `import hashlib
import hmac
import os

# Each webhook delivery is signed with HMAC-SHA256 over the raw
# request body using your endpoint's signing secret (whsec_...).
# The hex digest arrives in the "New Venue Data-Signature" header.
def verify_signature(raw_body: bytes, signature_header: str, signing_secret: str) -> bool:
    expected = hmac.new(
        signing_secret.encode("utf-8"),
        raw_body,
        hashlib.sha256,
    ).hexdigest()
    # Constant-time comparison to avoid timing attacks.
    return hmac.compare_digest(expected, signature_header or "")


# Flask handler. Use request.get_data() to read the raw bytes.
from flask import Flask, request, abort

app = Flask(__name__)


@app.post("/webhooks/licensesignal")
def handle_webhook():
    signature = request.headers.get("New Venue Data-Signature", "")
    if not verify_signature(
        request.get_data(),  # raw bytes, NOT request.json
        signature,
        os.environ["LICENSESIGNAL_WEBHOOK_SECRET"],
    ):
        abort(400, "Invalid signature")

    event = request.get_json()
    print("Received event:", event["type"])
    return "ok", 200`,
      },
      {
        label: 'Go',
        language: 'go',
        code: `package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
	"os"
)

// Each webhook delivery is signed with HMAC-SHA256 over the raw
// request body using your endpoint's signing secret (whsec_...).
// The hex digest arrives in the "New Venue Data-Signature" header.
func verifySignature(rawBody []byte, signatureHeader, signingSecret string) bool {
	mac := hmac.New(sha256.New, []byte(signingSecret))
	mac.Write(rawBody)
	expected := mac.Sum(nil)

	got, err := hex.DecodeString(signatureHeader)
	if err != nil {
		return false
	}
	// Constant-time comparison to avoid timing attacks.
	return hmac.Equal(expected, got)
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "cannot read body", http.StatusBadRequest)
		return
	}

	signature := r.Header.Get("New Venue Data-Signature")
	if !verifySignature(body, signature, os.Getenv("LICENSESIGNAL_WEBHOOK_SECRET")) {
		http.Error(w, "Invalid signature", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}`,
      },
      {
        label: 'PHP',
        language: 'php',
        code: `<?php

// Each webhook delivery is signed with HMAC-SHA256 over the raw
// request body using your endpoint's signing secret (whsec_...).
// The hex digest arrives in the "New Venue Data-Signature" header.
function verify_signature(string $rawBody, ?string $signatureHeader, string $signingSecret): bool
{
    $expected = hash_hmac('sha256', $rawBody, $signingSecret);
    // Constant-time comparison to avoid timing attacks.
    return hash_equals($expected, $signatureHeader ?? '');
}

$rawBody = file_get_contents('php://input');
$signature = $_SERVER['HTTP_LICENSESIGNAL_SIGNATURE'] ?? null;

if (!verify_signature($rawBody, $signature, getenv('LICENSESIGNAL_WEBHOOK_SECRET'))) {
    http_response_code(400);
    echo 'Invalid signature';
    exit;
}

$event = json_decode($rawBody, true);
error_log('Received event: ' . $event['type']);

http_response_code(200);
echo 'ok';`,
      },
    ],
  },
]
