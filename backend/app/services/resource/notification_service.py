"""
AgriSphere AI — Event-Driven Notification Engine (Module 5 Service 4)
Handles creation, dispatch, and unread counts for platform-wide events.
"""
from sqlalchemy.orm import Session
from ...repositories import notification_repository


def emit_notification_event(
    db: Session,
    user_id: str,
    title: str,
    message: str,
    event_type: str,
    reference_id: str | None = None,
    link_url: str | None = None,
) -> dict:
    """Emits event notification to target user."""
    notif = notification_repository.create_notification(
        db, user_id, title, message, event_type, reference_id, link_url
    )
    return {
        "id": notif.id,
        "user_id": notif.user_id,
        "title": notif.title,
        "message": notif.message,
        "type": notif.type,
        "reference_id": notif.reference_id,
        "link_url": notif.link_url,
        "is_read": notif.is_read,
        "created_at": notif.created_at.isoformat(),
    }


def get_user_notifications(db: Session, user_id: str = "usr_demo") -> dict:
    notifs = notification_repository.list_user_notifications(db, user_id)
    unread_count = notification_repository.get_unread_count(db, user_id)
    return {
        "unread_count": unread_count,
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "reference_id": n.reference_id,
                "link_url": n.link_url,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in notifs
        ],
    }


def mark_notification_read(db: Session, notification_id: str) -> bool:
    return notification_repository.mark_as_read(db, notification_id)


def mark_all_notifications_read(db: Session, user_id: str = "usr_demo") -> int:
    return notification_repository.mark_all_as_read(db, user_id)
