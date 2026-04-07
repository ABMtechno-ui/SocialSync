"""
Professional structured logging system with correlation ID tracking.

Provides end-to-end visibility across:
- API requests
- Celery tasks  
- External API calls (LinkedIn, Facebook, Instagram, etc.)
"""
import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any, Dict, Optional


class StructuredFormatter(logging.Formatter):
    """JSON formatter for structured logging."""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "service": record.name,
            "message": record.getMessage(),
        }
        
        # Add correlation ID if present
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        
        # Add platform if present
        if hasattr(record, "platform"):
            log_data["platform"] = record.platform
        
        # Add step/action if present
        if hasattr(record, "step"):
            log_data["step"] = record.step
        
        # Add extra context
        if hasattr(record, "extra_data"):
            log_data["extra"] = record.extra_data
        
        # Add error info if exception
        if record.exc_info and record.exc_info[0] is not None:
            log_data["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_data)


def configure_logging() -> None:
    """Configure structured JSON logging for the entire application."""
    
    # Remove default handlers
    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    
    # Create structured handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredFormatter())
    
    # Configure root logger
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
    
    # Set specific log levels
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("requests").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger with structured logging support.
    
    Usage:
        logger = get_logger("app.api")
        logger.info("User logged in", extra={"request_id": "abc123", "user_id": 123})
    """
    return logging.getLogger(name)


def log_event(
    logger: logging.Logger,
    level: str,
    message: str,
    request_id: Optional[str] = None,
    platform: Optional[str] = None,
    step: Optional[str] = None,
    extra: Optional[Dict[str, Any]] = None,
    exc_info: bool = False,
) -> None:
    """
    Log a structured event with optional context.
    
    Args:
        logger: Logger instance
        level: Log level (info, warning, error, exception)
        message: Log message
        request_id: Correlation ID for tracing
        platform: Platform name (facebook, instagram, etc.)
        step: Current step in the process
        extra: Additional context data
        exc_info: Include exception info
    """
    extra_dict = extra or {}
    
    # Create log record with custom attributes
    log_kwargs = {
        "extra": {
            "request_id": request_id or "N/A",
            "platform": platform or "N/A",
            "step": step or "N/A",
            "extra_data": extra_dict,
        }
    }
    
    if exc_info:
        log_kwargs["exc_info"] = True
    
    getattr(logger, level.lower())(message, **log_kwargs)
