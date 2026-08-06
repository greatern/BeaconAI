"""
Celery app for offloading AI enrichment off the request thread.

Broker and result backend are both the same Redis instance (Upstash
free tier) - same "hosted over local" pattern already used for
Postgres (Neon/Supabase), since Redis has no official native Windows
build and we'd rather not fight that.

--- Windows note ---
Celery's default worker pool ("prefork") uses os.fork(), which does
not exist on Windows. Without a workaround it silently misbehaves
(workers that appear to start but never pick up tasks, or crash with
obscure errors). Always start the worker with the solo pool on
Windows:

    celery -A app.core.celery_app worker --loglevel=info --pool=solo

The solo pool runs tasks one at a time in the worker's own process
(no child processes), which is fine for this project's volume. If
this ever needs real concurrency on Windows, look at the "threads" or
"gevent" pools instead of prefork.
"""
import ssl

from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "beacon",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    broker_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE,
    },
    redis_backend_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE,
    },
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    result_expires=3600,
)

celery_app.conf.imports = (
    "app.tasks.ai_tasks",
)