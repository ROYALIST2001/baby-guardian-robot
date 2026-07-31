# FILE: tests/test_cry_logic.py
# JOB: Test the "is this label crying" logic.

from app.services.cry_service import is_crying_label


def test_baby_cry_label_is_crying():
    # A clear crying label should return True.
    assert is_crying_label("Baby cry, infant cry") == True


def test_crying_word_is_crying():
    # A label with the word "crying" should return True.
    assert is_crying_label("Crying, sobbing") == True


def test_speech_label_is_not_crying():
    # A speech label should return False.
    assert is_crying_label("Speech") == False


def test_music_label_is_not_crying():
    # A music label should return False.
    assert is_crying_label("Music") == False


def test_is_not_case_sensitive():
    # Capital letters should still work.
    assert is_crying_label("BABY CRY") == True