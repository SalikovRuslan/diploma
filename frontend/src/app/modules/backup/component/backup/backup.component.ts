import { Component, OnInit } from '@angular/core';

import { AccountsService } from '../../../accounts/services/accounts.service';

@Component({
    selector: 'backup-main',
    templateUrl: './backup.component.html',
    styleUrls: ['./backup.component.less'],
})
export class BackupComponent implements OnInit {
    constructor(private accountsService: AccountsService) {}

    ngOnInit(): void {}

    makeBackup() {
        this.accountsService.getAccounts().subscribe(accounts => {
            console.log(accounts);
            const accountsString = accounts.reduce(
                (prev, account) =>
                    prev + `{\n  name: ${account.name}\n  username: ${account.username}\n  password: ${account.password}\n}\n`,
                '',
            );
            console.log(accountsString);
            this.createFile(accountsString);
        });
    }

    private createFile(fileString: string) {
        const link = document.createElement('a');
        link.download = 'data.txt';
        const file = new File([fileString], 'backup.txt', { type: 'text/plain' });
        link.href = window.URL.createObjectURL(file);
        link.click();
    }
}
