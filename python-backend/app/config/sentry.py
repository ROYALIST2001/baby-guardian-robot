# FILE: app/config/sentry.py
# JOB: Start error tracking, IF the key is set.
#      If it is not set, the app still runs normally.

import os
import sentry_sdk

DSN = os.environ.get("SENTRY_DSN_PYTHON", "")

# Is Sentry usable? Only if the key exists.
is_available = bool(DSN)

if is_available:
    sentry_sdk.init(
        dsn=DSN,
        # A name so we can tell our two backends apart.
        server_name="python-backend",
        # Collect detail on 10 percent of requests. Plenty, and cheap.
        traces_sample_rate=0.1,
        # NEVER send private data. This is a baby product.
        send_default_pii=False,
    )
    print("Sentry: error tracking is switched on for python-backend")
else:
    print("Sentry: no key set. Errors will only go to the logs.")


# ---- Report an error we already caught ----
def capture_error(error, context=None):
    # Always print it, so it is visible even without Sentry.
    print("ERROR:", str(error), context if context else "")

    # If Sentry is off, stop here. The app carries on.
    if not is_available:
        return

    with sentry_sdk.push_scope() as scope:
        if context:
            # Tags are searchable in Sentry.
            if context.get("service"):
                scope.set_tag("service", context["service"])
            # Extra data shows on the error page.
            # Only safe ids. No media, no tokens.
            for key, value in context.items():
                scope.set_extra(key, value)
        sentry_sdk.capture_exception(error)
