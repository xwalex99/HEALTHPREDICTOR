export class User {
  id: string;
  email: string;
  username: string;
  created_at?: Date;

  constructor(data: {
    id: string;
    email: string;
    username: string;
    created_at?: Date | string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.created_at = data.created_at
      ? typeof data.created_at === 'string'
        ? new Date(data.created_at)
        : data.created_at
      : undefined;
  }

}

