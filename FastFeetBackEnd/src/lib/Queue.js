import Bee from "bee-queue";

import * as Sentry from "@sentry/node";

import sentryConfig from "../config/sentry";

import SubscriptionMail from "../app/jobs/SubscriptionMail";
import redisConfig from "../config/redis";

Sentry.init(sentryConfig);

const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),

        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.on("failed", this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    if (process.env.NODE_ENV === "development") {
      console.log(`Queue ${job.queue.name}: FAILED`, err);
    }

    Sentry.captureException(err);
  }
}

export default new Queue();

// import Bee from "bee-queue";

// import redisConfig from "../config/redis";

// import CreationDeliveryMail from "../app/jobs/NotificationDeliveryMail";
// import CancelationDeliveryMail from "../app/jobs/CancelationDeliveryMail";

// const jobs = [CreationDeliveryMail, CancelationDeliveryMail];

// class Queue {
//   constructor() {
//     this.queues = {};

//     this.init();
//   }

//   init() {
//     jobs.forEach(({ key, handle }) => {
//       this.queues[key] = {
//         bee: new Bee(key, {
//           redis: redisConfig,
//         }),
//         handle,
//       };
//     });
//   }

//   add(queue, job) {
//     return this.queues[queue].bee.createJob(job).save();
//   }

//   hanleFailure(job, err) {
//     console.log(`Queue ${job.queue.name}: FAILED`, err);
//   }

//   processQueue() {
//     jobs.forEach((job) => {
//       const { bee, handle } = this.queues[job.key];

//       bee.on("failed", this.hanleFailure).process(handle);
//     });
//   }
// }

// export default new Queue();

// import Bee from "bee-queue";
// import CancellationMail from "../app/jobs/CancelationDeliveryMail";
// import redisConfig from "../config/redis";

// const jobs = [CancellationMail];

// class Queue {
//   constructor() {
//     this.queues = {};

//     this.init();
//   }

//   init() {
//     jobs.forEach(({ key, handle }) => {
//       this.queues[key] = {
//         bee: new Bee(key, {
//           redis: redisConfig,
//         }),
//         handle,
//       };
//     });
//   }

//   add(queue, job) {
//     return this.queues[queue].bee.createJob(job).save();
//   }

//   processQueue() {
//     jobs.forEach((job) => {
//       const { bee, handle } = this.queues[job.key];

//       bee.on("failed", this.handleFailure).process(handle);
//     });
//   }

//   handleFailure(job, err) {
//     console.log(`Queue ${job.queue.name}: FAILED`, err);
//   }
// }

// export default new Queue();
