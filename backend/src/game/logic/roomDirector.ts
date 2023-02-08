import { TypeBoutSocket } from '../types'
import { UserInformation } from '../types'

class RoomIDGenerator {
  private count: number

  constructor() {
    this.count = 1000
  }

  getID = () => {
    const tmp = this.count
    this.count += 1
    return tmp
  }
}

class RoomDirector {
  private rooms: Map<number, Room>
  private roomIDGenerator: RoomIDGenerator

  constructor() {
    this.rooms = new Map()
    this.roomIDGenerator = new RoomIDGenerator()
  }

  public createRoom = (user: TypeBoutSocket) => {
    const id = this.roomIDGenerator.getID()
    this.rooms.set(id, new Room(user, id))
    console.log(`Creating room with roomID: ${id}`)
    return id
  }

  public getRoom = (roomID: number) => this.rooms.get(roomID)

  public removeRoom = (roomID: number) => this.rooms.delete(roomID)
}

export class Room {
  public users: TypeBoutSocket[] = []
  // We only allow the admin to emit a start game event
  readonly admin: TypeBoutSocket
  readonly id: number

  constructor(user: TypeBoutSocket, id: number) {
    this.admin = user
    this.id = id
    this.addUser(user)
  }

  public addUser = (user: TypeBoutSocket) => {
    this.users.push(user)
    user.data.roomID = this.id
  }

  public removeUser = (user: TypeBoutSocket) => {
    this.users = this.users.filter((current) => current !== user)
  }

  public isEmpty = () => this.users.length === 0

  public getInformation = (): UserInformation[] =>
    this.users.map((user) => {
      const { isGuest, username } = user.data
      if (isGuest === undefined || username === undefined) {
        throw new Error('isGuest or username not attached to socket data')
      }
      return {
        isGuest,
        username
      }
    })
}

export default new RoomDirector()