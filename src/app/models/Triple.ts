export default class Triple {
  graph: string;
  subject: string;
  predicate: string;
  object: any

  constructor(subject, predicate, object, graph){
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.graph = graph;
  }
}
