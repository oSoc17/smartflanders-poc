export default class Triple {
  public subject: string;
  public predicate: string;
  public object: string;
  public graph: string;

  constructor(subject, predicate, object) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
  }
}
