const BUCKETS = {
    DEV: 'attachment-dev',
    TEST: 'attachment-test',
};
const getBucket = () => {
    switch (process.env.NODE_ENV) {
        case 'test':
            return BUCKETS.TEST;
        default:
            return BUCKETS.DEV;
    }
};

export { BUCKETS, getBucket };
export default BUCKETS;