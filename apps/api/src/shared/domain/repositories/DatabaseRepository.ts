export interface DatabaseRepository {
    checkConnection(): Promise<boolean>;
}
