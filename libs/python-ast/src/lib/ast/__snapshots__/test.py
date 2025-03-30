from dataclasses import dataclass
from uuid import UUID
from datetime import datetime
from typing import List, Dict, List

"""Module containing the User data model and related functionality."""

from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID
from dataclasses import dataclass, field


# Example usage:
# user = User.create("john_doe", "john@example.com")
# user.add_role("admin")
# print(f"Is admin: {user.is_admin}")


@dataclass
class User:
    """Represents a user in the system with their associated metadata."""

    id: UUID = UUID.uuid4()
    username: str = ''
    email: str = ''
    created_at: datetime = datetime.now()
    roles: List = field(default_factory=list)
    metadata: Dict = field(default_factory=dict)

    @classmethod
    def create(cls, username: str, email: str, roles: List = None) -> User:
        return cls(
            id=UUID.uuid4(),
            username=username,
            email=email,
            roles=roles or [],
            created_at=datetime.now(),
            metadata={})

    def add_role(self, role: str) -> None:
        if role not in self.roles:
            self.roles.append(role)

    @property
    def is_admin(self) -> bool:
        return 'admin' in self.roles