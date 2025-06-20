import { Query } from "mongoose";

class QueryBuilder<T> {
  public model: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(model: Query<T[], T>, query: Record<string, unknown>) {
    this.model = model;
    this.query = query;
  }
  // Search method
  search(searchAbleFields: string[]) {
    if (this?.query?.searchTerm) {
      const searchTerm = this.query.searchTerm as string;
      this.model = this.model.find({
        $or: searchAbleFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }
    return this;
  }

  // Filter method
  filter() {
    const queryObj = { ...this.query }; // copy
    const excludedFields = ["searchTerm", "page", "limit", "sort", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);
    this.model = this.model.find(queryObj);
    return this;
  }

  // sort method
  sort() {
    const sort = (this.query.sort as string) || "-createdAt";
    // this.model = this.model.sort(sort.split(",").join(" ")); //! need to test
    this.model = this.model.sort(sort);
    return this;
  }

  // Pagination method
  paginate() {
    const page = parseInt(this?.query?.page as string) || 1;
    const limit = parseInt(this?.query?.limit as string) || 10;
    const skip = (page - 1) * limit;
    this.model = this.model.skip(skip).limit(limit);
    return this;
  }
  // Fields method
  fields() {
    const fields = (this.query.fields as string) || "-__v";
    this.model = this.model.select(fields?.split(",")?.join(" "));
    return this;
  }
  //count total documents
  async countTotal() {
    const filter = this.model.getFilter();
    const total = await this.model.model.countDocuments(filter);
    const page = parseInt(this?.query?.page as string) || 1;
    const limit = parseInt(this?.query?.limit as string) || 10;
    const totalPage = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
