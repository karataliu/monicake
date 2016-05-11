package util;

use 5.010;
use strict;
use warnings;
use Exporter qw(import);

our @EXPORT_OK      = qw(installFile LOGDEBUG LOGINFO LOGWARN LOGERR);
our %EXPORT_TAGS    = (logLevel => [qw(LOGDEBUG LOGINFO LOGWARN LOGERR)]);

use constant {
    LOGDEBUG  => 1,
    LOGINFO   => 2,
    LOGWARN   => 3,
    LOGERR    => 4,
};

sub installFile
{
    my $path        = shift;
    my $content     = shift;

    $content =~ s/\$/\\\$/g if $content=~/\$/;
    runCmd("cat >$path <<EOF\n$content\nEOF");
}

1;
