export interface Vote {
  id: string;
  choiceId: string;
  userId: string;
  votedAt: Date;
  pollId: string;
}

export interface Choice {
  id: string;
  pollId: string;
  choiceText: string;
  votes: Vote[];
}

export interface Poll {
  id: string;
  link: string;
  discription: string;
  question: string;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  willExpire: boolean;
  userId: string;
  choices: Choice[];
}
