import { FilterQuery } from 'mongoose';
import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //partial match searching [query -> email=john@gma]
  search(searchableFields: string[]) {
    const searchParams = this?.query?.searchParams || '';

    if (searchParams) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              // {$name :{$regex: query.name, $options: 'i'}}
              [field]: { $regex: searchParams, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  //exact field value matching [query -> email=john@gmail.com]
  filter() {
    const queryObj = { ...this?.query };
    const excludeFields = ['searchParams', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);

    this.modelQuery = this?.modelQuery?.find(queryObj as FilterQuery<T>);

    return this;
  }

  //sorting [query -> sort=id,name]
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this?.modelQuery?.sort(sort);

    return this;
  }

  //paginating [query -> page=1&limit=1]
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this?.modelQuery?.skip(skip).limit(limit);

    return this;
  }

  //fileds limiting [query -> fields=name,email or fields=-name]
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
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
