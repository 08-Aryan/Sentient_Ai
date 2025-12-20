import os
import multiprocessing

# Gunicorn Configuration

# Binding
bind = "0.0.0.0:5001"

# Worker Options
# For CPU-bound tasks (ML inference), workers should be 2-4x cores.
# However, this is a hybrid IO/CPU app.
# If we assume 1GB RAM on Render Free Tier, limit workers to 2 to avoid OOM.
workers = int(os.getenv('GUNICORN_WORKERS', 2))
threads = 2
worker_class = 'gthread' # Threaded workers good for I/O bound (DB) + some CPU

# Timeout
# ML models might take time to load or predict
timeout = 120

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'
