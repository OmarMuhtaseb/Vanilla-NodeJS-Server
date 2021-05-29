import querystring, {ParsedUrlQuery} from 'querystring';

export class Utils {
    public static getQueryParams(urlQuery?: string): ParsedUrlQuery {
        if (!urlQuery) {
            return {};
        }
        const query = urlQuery.split('?')[1];
        return querystring.parse(query);
    }
}
