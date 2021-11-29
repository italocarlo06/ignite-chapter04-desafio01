import { Statement } from "../../entities/Statement";

export type ITransferStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'type' |
  'sender_id'
>
