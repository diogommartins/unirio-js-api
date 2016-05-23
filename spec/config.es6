import {Unirio} from "../lib/api";

export const KEYS = {
    VALID: {
        PRODUCTION: "812bdcee824a8fc9876c4c0b22580540a8d2330da2ec089d2e396afce2ee20332383a2df43936763358021ef9d147a33",
        DEVELOPMENT: "1a404993f3175002c90738a4e46b1d12c06ddcc42f01ffbbaecf3285b98f34dc3ac0b9db9e07fdfbe0587c6ef14e5c92"
    },
    INVALID: "INVALIDA93f3175002c90738a4e46b1d12c06ddcc42f01ffbbaecf3285b98f34dc3ac0b9db9e87c6ef14e5c93"

};

export const VALID_ENDPOINT = "UNIT_TEST";
export const TEST_ENV = Unirio.APIServers.LOCAL;
export const UNAUTHORIZED_PROCEDURE = 'FooProcedure';
export const UNAUTHORIZED_ENDPOINT = 'ALUNOS';