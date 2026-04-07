# 🔍 Professional Logging System - Complete Guide

## 🎯 **What You Now Have**

A **production-grade structured logging system** with **end-to-end request tracing** across:
- ✅ API requests
- ✅ Celery tasks
- ✅ External API calls (Facebook, Instagram, LinkedIn, etc.)
- ✅ Database operations
- ✅ Error tracking

---

## 📊 **How It Works**

### **Request Flow with Tracing:**

```
User Request
    ↓
[API Endpoint] ← request_id generated (e.g., "abc-123-def")
    ↓ logs: {"request_id": "abc-123-def", "step": "api_endpoint"}
    ↓
[Celery Task] ← request_id passed via kwargs
    ↓ logs: {"request_id": "abc-123-def", "step": "celery_task_start"}
    ↓
[Publish Service] ← request_id flows through
    ↓ logs: {"request_id": "abc-123-def", "platform": "facebook"}
    ↓
[External API] ← All calls logged
    ↓ logs: {"request_id": "abc-123-def", "step": "facebook_publish_success"}
    ↓
Result ← Full trace visible!
```

---

## 🔥 **See Everything in Action**

### **Method 1: Real-Time Docker Logs (BEST)**

```bash
# See ALL logs in one place
docker-compose logs -f backend worker

# See only errors
docker-compose logs -f backend worker 2>&1 | grep '"level": "ERROR"'

# Trace ONE request (replace with actual request_id)
docker-compose logs -f backend worker 2>&1 | grep "abc-123-def"

# See only Facebook/Instagram logs
docker-compose logs -f worker 2>&1 | grep '"platform": "facebook"'
```

### **Method 2: Filter by Request ID**

```bash
# Save logs to file
docker-compose logs backend worker > app.log

# Search for specific request
cat app.log | grep "request-id-here"

# See the full flow
cat app.log | grep "request-id-here" | jq .
```

### **Method 3: Use Flower (for Celery tasks)**

```bash
# Open Flower
http://localhost:5555

# You can see:
- Task execution times
- Success/failure rates
- Request IDs in task args
```

---

## 📝 **What Each Log Looks Like**

### **API Request Started:**
```json
{
  "timestamp": "2025-02-27T10:30:00.123Z",
  "level": "INFO",
  "service": "app.api.post",
  "message": "post.create_request",
  "request_id": "abc-123-def",
  "step": "api_endpoint",
  "extra": {
    "platform": "facebook",
    "content_preview": "Check out our new product...",
    "scheduled_at": "2025-02-27T12:00:00"
  }
}
```

### **Celery Task Started:**
```json
{
  "timestamp": "2025-02-27T12:00:00.456Z",
  "level": "INFO",
  "service": "app.worker.tasks",
  "message": "task.started",
  "request_id": "abc-123-def",
  "step": "celery_task_start",
  "extra": {
    "post_id": 42,
    "tenant_id": "tenant-123",
    "retry_count": 0
  }
}
```

### **Publish Success:**
```json
{
  "timestamp": "2025-02-27T12:00:05.789Z",
  "level": "INFO",
  "service": "app.publisher",
  "message": "publish.completed",
  "request_id": "abc-123-def",
  "platform": "facebook",
  "step": "publish_success",
  "extra": {
    "post_id": 42,
    "provider_post_id": "fb_123456789",
    "media_count": 2
  }
}
```

### **Error with Full Context:**
```json
{
  "timestamp": "2025-02-27T12:00:03.456Z",
  "level": "ERROR",
  "service": "app.publisher",
  "message": "publish.failed",
  "request_id": "abc-123-def",
  "platform": "instagram",
  "step": "publish_error",
  "extra": {
    "post_id": 42,
    "retry_count": 1,
    "error": "Media processing failed: Video too long",
    "retryable": false
  },
  "exception": "Traceback (most recent call last):\n..."
}
```

---

## 🎯 **Real Debugging Scenarios**

### **Scenario 1: Post Failed - Why?**

```bash
# Step 1: Find the request_id from frontend (check network tab)
# Step 2: Search logs
docker-compose logs worker 2>&1 | grep "request-id-from-frontend"

# You'll see:
✅ task.started
✅ publish.started
❌ publish.failed (with exact error message!)
✅ retry scheduled
```

### **Scenario 2: LinkedIn OAuth Failed**

```bash
# Search for LinkedIn errors
docker-compose logs backend 2>&1 | grep '"platform": "linkedin"' | grep ERROR

# See full trace:
docker-compose logs backend 2>&1 | grep "linkedin-oauth-request-id"

# You'll see:
✅ oauth.initiated
✅ code_received
❌ token_exchange_failed (with exact API response!)
```

### **Scenario 3: Instagram Carousel Issue**

```bash
# Find carousel posts
docker-compose logs worker 2>&1 | grep '"step": "instagram_carousel"'

# See media validation
docker-compose logs worker 2>&1 | grep '"platform": "instagram"' | grep media

# You'll see:
✅ media_validation_passed
✅ carousel_created (X items)
✅ publish_success
```

---

## 📊 **Log Analysis Commands**

### **Count Errors by Platform:**
```bash
docker-compose logs worker 2>&1 | \
  grep '"level": "ERROR"' | \
  grep -o '"platform": "[^"]*"' | \
  sort | uniq -c | sort -rn
```

### **Find Slow Requests:**
```bash
docker-compose logs backend 2>&1 | \
  grep 'request.completed' | \
  grep -o '"duration_ms": [0-9.]*' | \
  sort -t: -k2 -rn | head -20
```

### **Track Success Rate:**
```bash
# Success count
docker-compose logs worker 2>&1 | grep 'task.completed' | wc -l

# Failure count
docker-compose logs worker 2>&1 | grep 'task.failed' | wc -l
```

---

## 🔧 **How to Add More Logging**

### **In Any File:**

```python
from app.core.logging import get_logger, log_event

logger = get_logger("app.your_module")

# Simple log
log_event(
    logger, "info", "action_performed",
    request_id="abc-123",
    platform="facebook",
    step="processing",
    extra={"user_id": 123, "data": "more context"}
)

# Error log with stack trace
try:
    risky_operation()
except Exception as e:
    log_event(
        logger, "error", "operation_failed",
        request_id="abc-123",
        step="error",
        extra={"error": str(e)},
        exc_info=True  # Includes full stack trace
    )
```

---

## 🚀 **Pro Tips**

### **1. Always Include Request ID:**
```python
# In API endpoints
request_id = request.state.request_id

# In Celery tasks
request_id = kwargs.get("request_id", "N/A")
```

### **2. Log Key Steps:**
```python
# Start
log_event(logger, "info", "operation.started", ...)

# Progress
log_event(logger, "info", "operation.step_1", ...)

# Success
log_event(logger, "info", "operation.completed", ...)

# Error
log_event(logger, "error", "operation.failed", ..., exc_info=True)
```

### **3. Use jq for Pretty Printing:**
```bash
# Install jq (if not installed)
# Windows: choco install jq
# Mac: brew install jq

# Pretty print logs
docker-compose logs -f worker | jq .
```

---

## 📈 **What This Gives You**

| Feature | Before | After |
|---------|--------|-------|
| Error visibility | ❌ "Internal Server Error" | ✅ Exact error + stack trace |
| Request tracing | ❌ Scattered logs | ✅ Full flow with request_id |
| Platform debugging | ❌ Guess what failed | ✅ See exact API response |
| Performance | ❌ No timing data | ✅ Duration in ms |
| Retry tracking | ❌ Hidden | ✅ Visible with count |
| Media issues | ❌ Generic error | ✅ Specific validation errors |

---

## 🎯 **Quick Reference**

### **See All Logs:**
```bash
docker-compose logs -f backend worker
```

### **Find Request by ID:**
```bash
docker-compose logs -f | grep "your-request-id"
```

### **See Only Errors:**
```bash
docker-compose logs -f | grep '"level": "ERROR"'
```

### **Track One Post:**
```bash
# From frontend → get request_id
# Then:
docker-compose logs -f | grep "request-id"
```

---

## ✅ **What's Implemented**

- ✅ **Structured JSON logging** - All logs are JSON format
- ✅ **Request ID middleware** - Every request gets unique ID
- ✅ **ID propagation** - Flows through API → Celery → External APIs
- ✅ **Platform context** - Know which platform failed
- ✅ **Step tracking** - See exactly where in the process
- ✅ **Error context** - Full stack traces + extra data
- ✅ **Performance timing** - Request duration in ms
- ✅ **Retry tracking** - See retry count and backoff

---

## 🚀 **Next Steps (Optional)**

### **Level 2 - Error Dashboard:**
```bash
# Install Sentry (5 min setup)
pip install sentry-sdk

# Add to main.py
import sentry_sdk
sentry_sdk.init(dsn="YOUR_DSN")

# Boom! All errors → beautiful dashboard
```

### **Level 3 - Log Aggregation:**
```bash
# Use Loki + Grafana (for large scale)
# Collects all logs → searchable dashboard
```

---

## 💡 **Bottom Line**

**Before:**
> "Something broke, no idea where or why"

**Now:**
```json
{
  "request_id": "abc-123",
  "message": "publish.failed",
  "platform": "instagram",
  "step": "media_validation",
  "extra": {
    "error": "Video must be under 60 seconds",
    "actual_duration": 120
  }
}
```

👉 **Instant clarity. Zero guessing.** 🔥

---

**Your logging system is now PRODUCTION-GRADE!** 🎉

Start using: `docker-compose logs -f backend worker`
