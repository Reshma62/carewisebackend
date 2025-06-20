"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(model, query) {
        this.model = model;
        this.query = query;
    }
    // Search method
    search(searchAbleFields) {
        var _a;
        if ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) {
            const searchTerm = this.query.searchTerm;
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
        const queryObj = Object.assign({}, this.query); // copy
        const excludedFields = ["searchTerm", "page", "limit", "sort", "fields"];
        excludedFields.forEach((field) => delete queryObj[field]);
        this.model = this.model.find(queryObj);
        return this;
    }
    // sort method
    sort() {
        const sort = this.query.sort || "-createdAt";
        // this.model = this.model.sort(sort.split(",").join(" ")); //! need to test
        this.model = this.model.sort(sort);
        return this;
    }
    // Pagination method
    paginate() {
        var _a, _b;
        const page = parseInt((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = parseInt((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.model = this.model.skip(skip).limit(limit);
        return this;
    }
    // Fields method
    fields() {
        var _a;
        const fields = this.query.fields || "-__v";
        this.model = this.model.select((_a = fields === null || fields === void 0 ? void 0 : fields.split(",")) === null || _a === void 0 ? void 0 : _a.join(" "));
        return this;
    }
    //count total documents
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const filter = this.model.getFilter();
            const total = yield this.model.model.countDocuments(filter);
            const page = parseInt((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = parseInt((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
