import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

@Component({
  selector: 'app-stats-dialog',
  standalone: true,
  templateUrl: './stats-dialog.html',
  styleUrls: ['./stats-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsDialogComponent {

  public articlesCount = input.required<number>();

  public closeDialog = output<void>();

  protected close(): void {
    this.closeDialog.emit();
  }
}