const request = require('supertest');
const app = require('../../../src/app');

const {PaymentType} = require('../../../src/orm/sql/models');

const PaymentTypesDump = require('./dump/paymentTypes').paymentTypes;
const paymentTypeService = require('../../../src/services/paymentTypeService');

jest.mock('../../../src/middlewares/checkToken');
jest.mock('../../../src/logger');

describe('get payment types', () => {
  const PAYMENT_TYPES_API_URL = '/api/paymentTypes';

  describe('success responses', () => {
    describe('success with data', () => {
      beforeAll(async () => {
        for (const paymentType of PaymentTypesDump) {
          await PaymentType.create(paymentType);
        }
      });

      afterAll(async () => {
        await PaymentType.destroy({
          where: {}
        });
      });

      test('should return 200 and correct payment types when requested', done => {
        request(app)
          .get(PAYMENT_TYPES_API_URL)
          .set('Accept', 'application/json')
          .expect(res => {
            const {paymentTypes} = res.body;

            expect(paymentTypes).toHaveLength(3);
            expect(paymentTypes[0].name).toBe('paypal');
            expect(paymentTypes[1].name).toBe('transfer');
            expect(paymentTypes[2].name).toBe('credit_card');
          })
          .expect(200, done);
      });
    });

    describe('success without data', () => {
      test('should return 204 when there are no payment types', done => {
        request(app)
          .get(PAYMENT_TYPES_API_URL)
          .set('Accept', 'application/json')
          .expect(204, '', done);
      });
    });
  });

  describe('error responses', () => {
    test('should return 500 when error occurs on service', done => {
      paymentTypeService.getAllPaymentTypes = jest.fn();
      paymentTypeService.getAllPaymentTypes.mockRejectedValueOnce(
        new Error('morreu')
      );
      request(app)
        .get(PAYMENT_TYPES_API_URL)
        .set('Accept', 'application/json')
        .expect(res => {
          const {body} = res;
          expect(body).toEqual({
            message: 'An unexpected error occurred'
          });
        })
        .expect(500, done);
    });
  });
});
