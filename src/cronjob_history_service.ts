import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {Cronjob, ICronjobHistoryRepository, ICronjobHistoryService} from '@process-engine/cronjob_history.contracts';

const superAdminClaim = 'can_manage_process_instances';
const canReadCronjobHistoryClaim = 'can_read_cronjob_history';

export class CronjobHistoryService implements ICronjobHistoryService {

  private readonly cronjobHistoryRepository: ICronjobHistoryRepository;
  private readonly iamService: IIAMService;

  constructor(
    cronjobHistoryRepository: ICronjobHistoryRepository,
    iamService: IIAMService,
  ) {
    this.cronjobHistoryRepository = cronjobHistoryRepository;
    this.iamService = iamService;
  }

  public async create(identity: IIdentity, cronjob: Cronjob): Promise<void> {
    await this.ensureUserHasClaim(identity, canReadCronjobHistoryClaim);

    return this.cronjobHistoryRepository.create(cronjob);
  }

  public async getAll(identity: IIdentity, offset: number = 0, limit: number = 0): Promise<Array<Cronjob>> {
    await this.ensureUserHasClaim(identity, canReadCronjobHistoryClaim);

    return this.cronjobHistoryRepository.getAll(offset, limit);
  }

  public async getByProcessModelId(
    identity: IIdentity,
    processModelId: string,
    startEventId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<Array<Cronjob>> {
    await this.ensureUserHasClaim(identity, canReadCronjobHistoryClaim);

    return this.cronjobHistoryRepository.getByProcessModelId(processModelId, startEventId, offset, limit);
  }

  public async getByCrontab(identity: IIdentity, crontab: string, offset: number = 0, limit: number = 0): Promise<Array<Cronjob>> {
    await this.ensureUserHasClaim(identity, canReadCronjobHistoryClaim);

    return this.cronjobHistoryRepository.getByCrontab(crontab, offset, limit);
  }

  private async ensureUserHasClaim(identity: IIdentity, claimName: string): Promise<void> {

    const userIsSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);
    if (userIsSuperAdmin) {
      return;
    }

    await this.iamService.ensureHasClaim(identity, claimName);
  }

  private async checkIfUserIsSuperAdmin(identity: IIdentity): Promise<boolean> {
    try {
      await this.iamService.ensureHasClaim(identity, superAdminClaim);

      return true;
    } catch (error) {
      return false;
    }
  }

}
