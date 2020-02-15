import { StatuspageComponent } from './statuspage/statuspage.component';
import { QueryComponent } from './query/query.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetaDataListComponent } from './meta-data-list/meta-data-list.component';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { MetadataUploadComponent } from './metadata-upload/metadata-upload.component';
// import { VisualizerComponent } from './visualizer/visualizer.component';

const routes: Routes = [ 
  { path: '',  component: QueryComponent  }, 
  { path: 'list', component:  MetaDataListComponent },
  { path: 'up', component:  MetadataUploadComponent },
  { path: 'view', component:  VisualizerComponent },
  { path: 'status', component:  StatuspageComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
