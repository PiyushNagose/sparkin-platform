function roomTimestamp(room) {
  return new Date(
    room?.lastMessageAt || room?.updatedAt || room?.createdAt || 0,
  ).getTime();
}

export function sortChatRooms(rooms) {
  return [...rooms].sort((a, b) => roomTimestamp(b) - roomTimestamp(a));
}

export function upsertChatRoom(rooms, incomingRoom) {
  if (!incomingRoom?.roomId) return sortChatRooms(rooms);

  let found = false;
  const nextRooms = rooms.map((room) => {
    if (room.roomId !== incomingRoom.roomId) return room;
    found = true;
    return { ...room, ...incomingRoom };
  });

  if (!found) {
    nextRooms.push(incomingRoom);
  }

  return sortChatRooms(nextRooms);
}

export function markChatRoomRead(rooms, roomId, userId) {
  return rooms.map((room) => {
    if (room.roomId !== roomId || !userId) return room;
    return {
      ...room,
      unreadCount: {
        ...(room.unreadCount || {}),
        [userId]: 0,
      },
    };
  });
}
