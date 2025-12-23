import { Module } from '@nestjs/common';
import { ElasticService } from './elastic.service';

@Module({
    imports: [],
    providers: [ElasticService],
    exports: [ElasticService],
})
export class ElasticModule {}
