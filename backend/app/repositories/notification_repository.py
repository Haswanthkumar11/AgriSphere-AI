"""
AgriSphere AI — Notification Repository (Module 5)
Data access layer for platform-wide notifications.
"""
from sqlalchemy.orm import Session
from ..models.notification import Notification


def create_notification(db: Session, user_id: str, title: str, message: str, type_: str, reference_id: str | None = None, link_url: str | None = None) -> Notification:
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type_,
        reference_id=reference_id,
        link_url=link_url,
        is_read=False,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def list_user_notifications(db: Session, user_id: str, limit: int = 30) -> list[Notification]:
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).limit(limit).all()


def get_unread_count(db: Session, user_id: str) -> int:
    return db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()


def mark_as_read(db: Session, notification_id: str) -> bool:
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        return False
    notif.is_read = True
    db.commit()
    return True


def mark_all_as_read(db: Session, user_id: str) -> int:
    count = db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return count
