# FILE: tests/test_cache.py
# JOB: Test the cache key functions.

from app.config.cache import make_exact_key, make_recent_key


def test_same_bytes_make_same_exact_key():
    # The same file bytes must always make the same key.
    data = b"hello audio bytes"
    key1 = make_exact_key("cry", data)
    key2 = make_exact_key("cry", data)
    assert key1 == key2


def test_different_bytes_make_different_keys():
    # Different bytes must make different keys.
    key1 = make_exact_key("cry", b"audio one")
    key2 = make_exact_key("cry", b"audio two")
    assert key1 != key2


def test_exact_key_starts_with_prefix():
    # The key should start with the prefix, like "cry:".
    key = make_exact_key("cry", b"some data")
    assert key.startswith("cry:")


def test_recent_key_uses_baby_id():
    # The recent key should contain the baby id.
    key = make_recent_key("cry_recent", "baby-123")
    assert key == "cry_recent:baby-123"