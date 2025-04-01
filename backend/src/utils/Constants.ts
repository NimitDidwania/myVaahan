export class DependencyKeys {
    public static readonly Routes: string = "Routes";
    public static readonly AuthService: string = "AuthService";
    public static readonly FaceAuthService: string = "FaceAuthService";
    public static readonly TrackService: string = "TrackService";
    public static readonly CompanyService: string = "CompanyService";
    public static readonly GeneralSettingsService: string = "GeneralSettingsService";
    public static readonly UserGroupService: string = "UserGroupService";
    public static readonly UserService: string = "UserService";
    public static readonly ApproverService: string = "ApproverService";
    public static readonly EmailClient: string = "EmailClient";
    public static readonly DbConfigProvider: string = "DbConfigProvider";
    public static readonly RepositoryFactory: string = "RepositoryFactory";
    public static readonly VehicleService: string = "VehicleService";

}

export class CollectionNames {
    public static readonly Vehicles: string = "vehicles";
    public static readonly Users: string = "vUsers";

}

export class JobStatuses {
    public static readonly Draft: string = "Draft";
    public static readonly Live: string = "Live";
    public static readonly Closed: string = "Closed";
}
export class RouteKeys {
    public static readonly api: string = "api";
    public static readonly Auth: string = "auth";
    public static readonly Vehicles: string = "vehicles";
    public static readonly Config: string = "config";
}

export class ResourceAction {
    public static readonly Create: string = "Create";
    public static readonly Update: string = "Update";
    public static readonly Delete: string = "Delete";
}

export class ResourceTypes {
    public static readonly User: string = "user";
    public static readonly LastInvoice : string = "last invoice"
}

export class QueryParams {
    public static readonly PageNum: string = "pageNum";
    public static readonly PageSize: string = "pageSize";
    public static readonly Filter: string = "filter";
    public static readonly SortOrder: string = "sortOrder";
    public static readonly SortBy: string = "sortBy";
}

export class JobApplicationStatus { 
    public static readonly Draft: string = "draft";
    public static readonly Submitted: string = "submitted";
    public static readonly Hired: string = "hired";
    public static readonly Rejected: string = "rejected";
}

export class FileExtensions{
    public static readonly JPG = "jpg";
    public static readonly JPEG = "jpeg";
    public static readonly PNG = "png";
    public static readonly GIF = "gif";
    public static readonly SVG = "svg";
    public static readonly DOC = "doc";
    public static readonly DOCX = "docx";
    public static readonly XLS = "xls";
    public static readonly XLSX = "xlsx";
    public static readonly CSV = "csv";
    public static readonly PDF = "pdf";
    public static readonly TTF = "ttf";
    public static readonly OTF = "otf";
    public static readonly FNT = "fnt";
    public static readonly WOFF = "woff";
}

export class FolderNames{
    public static readonly IMAGES = "images";
    public static readonly DOCUMENTS = "documents";
    public static readonly BINARY = "binary";
    public static readonly PDFS = "pdfs";
    public static readonly FONTS = "fonts";
}

export class InvitedUserStatus{
    public static readonly PENDING = "pending";
    public static readonly ACTIVE = "active";
}